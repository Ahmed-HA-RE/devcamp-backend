import colors from '@colors/colors';

export function logger(req, res, next) {
  const methodColors = {
    GET: 'green',
    POST: 'yellow',
    PUT: 'blue',
    DELETE: 'red',
  };

  const color = methodColors[req.method];

  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.url}`[color]
  );
  next();
}
