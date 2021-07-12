# action-pr-enable-auto-merge
GitHub Action to enable automatic merge on a pull request

## Usage

```
- uses: scoremedia/action-pr-enable-auto-merge@v1
  with:
    token: ${{ secrets.PAT }}
    pull-request-url: 'https://github.com/octokit/octokit/1'
    type: 'squash'
    author: 'actions@github.com'
    commit-headline: 'My best feature'
    commit-message: 'My feature is so awesome'
```

## Inputs


| Input | Default | Description |
--- | --- | ---
| token | github.token | The token used for github API |
| pull-request-url | * | Full html url for the pull request |
| type | merge | merge, squash, or rebase method by which to merge |
| author | * | The email address for the author to associate with the commit |
| commit-headline | * | The commit headline |
| commit-message | * | The commit message |
|

## Contribution

See [github documentation](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github)

### Development

- Run npm install in the directory
- Make updates
- Follow release steps
- [Create a PR](https://github.com/scoremedia/action-pr-enable-auto-merge/pulls)

### Release

- Install `vercel/ncc` by running this command in your terminal. `npm i -g @vercel/ncc`
- Compile your `index.js` file. `ncc build index.js --license licenses.txt`

