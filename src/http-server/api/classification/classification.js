import Boom from 'boom';
import Classifier from '../../../domain/classification';

export default async function makeClassification(ctx) {
  const {request, response} = ctx;

  try {
    const result = await new Classifier(request.query.subject).init();
    response.status = 200;
    response.body = result;
  } catch (err) {
    throw Boom.badData('Invalid', err);
  }
}
