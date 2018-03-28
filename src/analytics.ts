import { AnalyticsUser } from './analytics-user';
import { AnalyticsProvider, Config } from './models';
import { NodeProvider } from './providers';

export class Analytics {
  private config: Config
  private provider: AnalyticsProvider

  constructor(config: Config) {
    // TODO: Validate config here...
    this.config = config
    // TODO: Switch provider impl. depending on whether we are on mobile, web or server
    this.provider = new NodeProvider(config)
  }

  public user(userId: string) {
    return new AnalyticsUser(this.provider, userId)
  }

  // TODO: Add some tests
  public async flush() {
    return this.provider.flush()
  }
}
