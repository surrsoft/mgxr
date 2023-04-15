import { isEmptyOrWhitespaces } from './app-utils';

const MGXR_LS_AIRTABLE_API_KEY = 'mgxr_ls_airtable_api_key';

/** хранилище Airtable-ключа. Хранится в Local Storage */
export class LSApiKey {
  static apiKeyGet(): string | null {
    return localStorage.getItem(MGXR_LS_AIRTABLE_API_KEY);
  }

  static apiKeySet(apiKey?: string): boolean {
    if (isEmptyOrWhitespaces(apiKey)) {
      return false;
    } else if (apiKey) {
      localStorage.setItem(MGXR_LS_AIRTABLE_API_KEY, apiKey);
      return true;
    }
    return false;
  }
}