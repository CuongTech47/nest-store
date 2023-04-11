import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import {ElasticsearchModule} from "@nestjs/elasticsearch";

@Module({
  imports: [ElasticsearchModule.register({
    // node : 'https://localhost:9200'
  }),

  ] })
export class SearchModule {}
