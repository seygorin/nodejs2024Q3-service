import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { ArtistsModule } from '@/artists/artists.module';
import { AlbumsModule } from '@/albums/albums.module';
import { TracksModule } from '@/tracks/tracks.module';
import { FavoritesModule } from '@/favorites/favorites.module';
import { LoggingService } from './logging/logging.service';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
  ],
  providers: [LoggingService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
