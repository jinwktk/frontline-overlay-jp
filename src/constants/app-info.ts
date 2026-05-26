import PackageJson from '../../package.json'

class AppInfo {
  static readonly version = PackageJson.version
  static readonly githubRepo = 'https://github.com/jinwktk/frontline-overlay-jp'
  static readonly changelogDoc = 'https://jinwktk.github.io/frontline-overlay-jp/changelog'

  static readonly balanceConstants = {
    watchedPlayersMaxCount: 30,
  } as const
}

export default AppInfo
