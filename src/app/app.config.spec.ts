import { appConfig, LoggingInterceptor } from './app.config';

describe('appConfig', () => {
  it('should provide the application-level services', () => {
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });
});

describe('LoggingInterceptor', () => {
  it('should be constructable for dependency injection', () => {
    expect(new LoggingInterceptor()).toBeTruthy();
  });
});
