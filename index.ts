import dotenv from 'dotenv';
import { automation } from '@pulumi/pulumi';
import { Repository, IssueLabel } from '@pulumi/github';
import { Octokit } from '@octokit/rest';

dotenv.config();

interface IssueBase {
  number: number;
}

async function pulumiProgram() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const reposToTrack = ['demo-longphan/frontend']; // Replace with your repos
  const milestoneProgress = new Map();

  for (const repo of reposToTrack) {
    const [owner, repoName] = repo.split('/');

    // Manage repository with Pulumi
    new Repository(
      `${repoName}-resource`,
      {
        name: repoName,
        description: 'Managed by Milestone Motivator',
        autoInit: false, // Prevent re-initialization
      },
      { protect: true },
    );

    // Fetch milestone data with Octokit
    const { data: milestones } = await octokit.issues.listMilestones({
      owner,
      repo: repoName,
      state: 'open',
    });

    if (milestones.length === 0) continue;

    for (const milestone of milestones) {
      const milestoneNumber = milestone.number;
      const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo: repoName,
        milestone: milestoneNumber.toString(),
        state: 'all',
      });

      console.log('issues', issues);

      const totalIssuesLength = issues.length;
      const closedIssues: IssueBase[] = [];
      const openningIssues: IssueBase[] = [];
      issues.forEach(issue => {
        if (issue.state === 'closed') closedIssues.push(issue);
        else openningIssues.push(issue);
      });
      const closedIssuesLength = closedIssues.length;
      const progress = totalIssuesLength > 0 ? Math.round((closedIssuesLength / totalIssuesLength) * 100) : 0;
      milestoneProgress.set(`${repo}-milestone-${milestoneNumber}`, progress);

      // Create motivational comment with Octokit
      if (progress > 0 && issues.length > 0) {
        let message = '';
        if (progress >= 75) message = '🚀 Almost there! 75% done – keep the momentum going!';
        else if (progress >= 50) message = '💪 Halfway there at 50%! You’ve got this!';
        else if (progress >= 25) message = '🌟 Great start! 25% complete – let’s keep pushing!';

        if (message) {
          for (const issue of openningIssues) {
            const issueNumber = issue?.number || 1;
            const { data: comments } = await octokit.issues.listComments({
              owner,
              repo: repoName,
              issue_number: issueNumber,
            });

            const commentExists = comments.some(comment => comment.body === message);

            if (!commentExists) {
              console.log(`Posting comment to issue #${issueNumber} in ${repo}...`);
              await octokit.issues.createComment({
                owner,
                repo: repoName,
                issue_number: issueNumber,
                body: message,
              });
              console.log('CREATED COMMENT!');
            } else {
              console.log(`Comment already exists for issue #${issueNumber} in ${repo}. Skipping...`);
            }
          }
        }

        // Add label with Pulumi if 100% complete (set >= 100 for edge cases)
        if (progress >= 100) {
          let presentativeIssueNumber = Math.max(...closedIssues.map(issue => issue.number));
          const doneMessage = '🎉 Amazing work! Milestone 100% complete! You’re unstoppable!';

          const { data: comments } = await octokit.issues.listComments({
            owner,
            repo: repoName,
            issue_number: presentativeIssueNumber,
          });

          const commentExists = comments.some(comment => comment.body === doneMessage);

          if (!commentExists) {
            console.log(`Posting comment to issue #${presentativeIssueNumber} in ${repo}...`);

            await octokit.issues.createComment({
              owner,
              repo: repoName,
              issue_number: presentativeIssueNumber,
              body: doneMessage,
            });

            new IssueLabel(`${repoName}-milestone-star`, {
              repository: repoName,
              name: 'Milestone Star',
              color: 'FFD700',
              description: 'Awarded for completing a milestone on time!',
            });

            console.log(`Assigning label "Milestone Star" to issue #${presentativeIssueNumber} in ${repo}...`);
            await octokit.issues.addLabels({
              owner,
              repo: repoName,
              issue_number: presentativeIssueNumber,
              labels: ['Milestone Star'],
            });
            console.log('CREATED COMMENT!');
          } else {
            console.log(
              `Issue #${presentativeIssueNumber} already done! Comment already exists for this issue in ${repo}.`,
            );
          }
        }
      }
    }
  }

  return { milestoneProgress: Object.fromEntries(milestoneProgress) };
}

async function runMilestoneMotivator() {
  try {
    const stack = await automation.LocalWorkspace.createOrSelectStack({
      stackName: 'dev',
      projectName: 'github-milestone-motivator',
      program: pulumiProgram,
    });

    await stack.workspace.installPlugin('github', 'v6.2.0');
    await stack.setConfig('github:token', { value: process.env.GITHUB_TOKEN!, secret: true });
    await stack.setConfig('github:owner', { value: 'demo-longphan' });

    console.log('Deploying...');
    const upResult = await stack.up({ onOutput: console.log });
    console.log('Milestone Progress:', upResult.outputs.milestoneProgress.value);
  } catch (error) {
    console.error('Error:', error);
  }
}

runMilestoneMotivator();
