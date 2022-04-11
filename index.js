const core = require('@actions/core');
const github = require('@actions/github');



async function run() {

    try {
        //  Get some context info
        const contextRepo = github.context.payload.repository.name
        const contextOwner = github.context.payload.repository.owner.login

        // open-pr-label to filter
        const prLabel = core.getInput('open-pr-label');


        // The YML workflow will need to set myToken with the GitHub Secret Token
        // myToken: ${{ secrets.GITHUB_TOKEN }}
        const githubToken = core.getInput('github-token');

        // octrokit is used for rest calls to github
        const octokit = github.getOctokit(githubToken);

        // Get List of PRS
        const { data: pullRequest } = await octokit.rest.pulls.list({
            owner: contextOwner,
            repo: contextRepo,
            state: 'open'
        });


        // init empty list
        var pullRequestBranches = [];

        // loop through PRs anbd match labels
        pullRequest.forEach((pull) => {
            pull.labels.forEach((label) => {
                console.log(label.name)
                if (label.name == prLabel) {
                    pullRequestBranches.push("origin/" + pull.head.ref)
                }
            })
        })

        // return a string for octopus merge
        ocotopusMergeString = pullRequestBranches.join(" ");
        core.setOutput("octopus-merge-string", ocotopusMergeString);
    } catch (error) {
        core.setFailed(error);
    }

}
run();