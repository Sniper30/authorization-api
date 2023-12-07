import { SetMetadata } from '@nestjs/common';

const keyIsPublic = 'isPublic';
export const isPublic = () => SetMetadata(keyIsPublic, true);
