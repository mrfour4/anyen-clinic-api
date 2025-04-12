import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );
    }

    getClient(): SupabaseClient {
        return this.client;
    }

    async uploadToStorage(
        file: Buffer,
        filename: string,
        mimetype: string,
    ): Promise<string> {
        const result = await this.client.storage
            .from('chat-media')
            .upload(filename, file, {
                contentType: mimetype,
                upsert: false,
            });

        if (result.error) {
            throw new Error('Upload failed: ' + result.error.message);
        }

        return this.getPublicUrl(filename);
    }

    getPublicUrl(path: string): string {
        return this.client.storage.from('chat-media').getPublicUrl(path).data
            .publicUrl;
    }
}
