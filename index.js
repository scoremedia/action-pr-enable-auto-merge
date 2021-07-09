const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('token');

if(!token) {
    console.log("token is nil")
    core.setFailed("The github token is nil");
    return
}
const octokit = github.getOctokit(token)

async function getPullRequestId(url) {
    const query = `query($pullRequestURL: URI!) {
        resource(url: $pullRequestURL) {
          ... on PullRequest {
            id
          }
        }
      }`;
    const variables = {
        pullRequestURL: url
    }

    const result = await octokit.graphql(query, variables)
    
    if (result.errors && result.errors.length > 0) {
        throw result.errors[0].message
    }

    if (!result.resource.id) {
        throw 'unexpected error. Could not get id for pull request'
    }

    return result.resource.id
}

async function enablePullRequestAutoMerge(pullId, mergeMethod, author, commitHeadline, commitBody) {
    const query = `mutation($pullId: ID!, $mergeMethod: PullRequestMergeMethod!, $authorEmail: String!, $commitHeadline: String!, $commitBody: String) {
        enablePullRequestAutoMerge(input: {pullRequestId: $pullId, authorEmail: $authorEmail, commitBody: $commitBody, commitHeadline: $commitHeadline, mergeMethod: $mergeMethod}) {
          __typename
        }
      }`;
    const variables = {
        pullId: pullId,
        mergeMethod: mergeMethod,
        authorEmail: author,
        commitHeadline: commitHeadline,
        commitBody: commitBody
    }
    const result = await octokit.graphql(query, variables)

    if (result.errors && result.errors.length > 0) {
        throw result.errors[0].message
    }

    if (!result.enablePullRequestAutoMerge) {
        throw 'unexpected error'
    }
}

function getMergeMethod(type) {
    if (type == "squash") {
        return "SQUASH"
    } else if (type == "rebase") {
        return "REBASE"
    } else {
        return "MERGE"
    }
}

async function run() {
    var pullRequestUrl = core.getInput('pull-request-url');
    const mergeType = core.getInput('type');
    const author = core.getInput('author');
    const headline = core.getInput('commit-headline');
    const message = core.getInput('commit-message');

    if (!pullRequestUrl && github.context.eventName == 'pull_request') {
        pullRequestUrl = github.context.payload.pull_request.html_url
    }

    if (!pullRequestUrl) {
        core.setFailed("Pull request url is required");
        return
    }
    
    try {
        const pullId = await getPullRequestId(pullRequestUrl)
        await enablePullRequestAutoMerge(
            pullId,
            getMergeMethod(mergeType),
            author,
            headline,
            message
        )
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()