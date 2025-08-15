import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_KEY');
    // console.log('SUPABASE_URL:', this.configService.get('SUPABASE_URL'));
    // console.log('SUPABASE_KEY:', this.configService.get('SUPABASE_KEY'));

    if (!url || !key) {
      throw new Error('Supabase URL або KEY не задані в .env');
    }

    this.client = createClient(url, key);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
