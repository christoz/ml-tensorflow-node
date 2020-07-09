import Boom from 'boom';
import fs from 'fs';
import path from 'path';

import {zip} from '../../../shared/archive';

export default async function downloadModel(ctx) {
  const {request} = ctx;
  const rootPath = path.resolve(path.dirname(require.main.filename), '../');
  const src = path.resolve(rootPath, `ml-models/${request.query.file}-model/`);
  const output = path.resolve(rootPath, `downloads/${request.query.file}-model.zip`);

  try {
    if (fs.existsSync(src)) {
      await zip(src, output);
      ctx.body = fs.createReadStream(output);
      ctx.attachment(output);
    } else {
      throw new Error('Requested data not found');
    }
  } catch (error) {
    throw Boom.boomify(error, {statusCode: 400});
  }
}
