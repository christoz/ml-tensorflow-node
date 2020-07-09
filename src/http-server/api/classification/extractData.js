import Boom from 'boom';
import path from 'path';

import {unzip} from '../../../shared/archive';

export default async function extractData(ctx) {
  const {request} = ctx;
  const {file} = request;
  const rootPath = path.resolve(path.dirname(require.main.filename));

  try {
    await unzip(file.path, path.resolve(rootPath, 'domain/classification/data'));

    ctx.body = {
      message: 'OK',
      data: file,
    };
  } catch (error) {
    throw Boom.badRequest(error);
  }
}
