# Github Milestone Motivator

<p align="center">
  <img src="https://github.com/longphanquangminh/minhlong-responsive-portfolio/blob/master/images/milestone.png?raw=true" alt="milestone">
</p>

GitHub Milestone Motivator is a creative automation tool built with Pulumi and the GitHub API to streamline the milestone tracking process and motivate software engineers.

## Features

- Track milestone progress across repositories
- Post motivational comments on issues (e.g., "Halfway there at 50%!")
- Create and assign a "Milestone Star" label for completed milestones

## How It Works


<img width="1426" alt="image" src="https://github.com/user-attachments/assets/b5944194-b52d-40e9-a7a2-11280d899968" />


When the program is executed, it will scan all the repositories defined by the user. For each repository, it will check its milestones, and within each milestone, it will examine the related issues. There are two possible scenarios:

1. If the milestone is not completed yet, the program will check the progress percentage. Based on the percentage (25%, 50%, 75%, or 100%), it will display an encouraging message accordingly.
2. If the milestone is 100% complete, a congratulatory comment will be added by the manager to the representative issue (the last issue) to celebrate the team’s success.

## Setup Instructions

1. Clone the repository: `git clone https://github.com/longphanquangminh/creative-pulumi-github-contest.git`
2. Navigate to the project directory: `cd creative-pulumi-github-contest`
3. Install dependencies: `npm i` (or `npm install` for clarity)

## Configuration and Usage

### **Step 1: Create Github token**

- Navigate to your **Github avatar → Settings → Developer settings → Personal Access Token → Tokens (classic) → Generate new token → Generate new token (classic)**
- Choose these two permissions, which are sufficient:
  - `repo` (Full control of repositories)
  - `admin:org` (Manage organization settings)
- Save the generated token—you’ll need it later

<img width="1715" alt="image" src="https://github.com/user-attachments/assets/49789ff4-1d4a-40e2-bdb3-32df1e27d588" />

### **Step 2: Create Pulumi access token**

- Register or log in to your Pulumi account.
- Upon successful login, you will be redirected to the dashboard page, click on the avatar, and select "Personal access tokens"
- Write a description (e.g., "Pulumi personal token"), select an expiration date, and click "Create token" button
- Save the token, as you won’t be able to view it again.

<img width="1728" alt="image" src="https://github.com/user-attachments/assets/93c76369-542f-447b-b6e6-8a7983664fd2" />

### **Step 3: Configure Environment Variables**

- Create a `.env` file in the root directory (or copy the sample file `.env.example` as a starting point)
- Add/edit the following environment variables:

   ```env
   GITHUB_TOKEN=your_generated_github_token_in_step_1
   PULUMI_ACCESS_TOKEN=your_generated_pulumi_token_in_step_2
   ```

### **Step 4: Run the Development Script and View Results**
- After you’ve made all the necessary changes in the `index.ts` file according to your needs, run the script: `npm run dev`
- Witness the magical result ✨

## Support

If you have any questions or need assistance, I am ready to help. Contact me via email at phanquangminhlong@gmail.com or reach out on my social media.

Hope you have a fantastic time exploring this amazing tool!


## Useful Links

🌟 Dev.to blog: https://dev.to/minhlong2605/github-milestone-motivator-an-innovative-idea-from-pulumi-intriguing-challenge-ej2

📣 Dev Community shared this on X (fka Twitter) – 3,770+ views as of April 2025: https://x.com/ThePracticalDev/status/1911621746974679521

---

This project is developed and contributed by [Long Phan](https://github.com/longphanquangminh) 🇻🇳
