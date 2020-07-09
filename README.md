## Development

```sh
# start in development mode using nodemon
yarn dev

# start in debug mode
yarn debug

# run linters (eslint + prettier)
yarn lint

# create production build
yarn build

# start production build
yarn start
```

# Create human readable labels

```
NODE_LABEL=your_subject yarn createLabels
```

# Upload data

The data are expected to be organised in folders matching the label which describes the class of the data subsequently for example it communicates as food type.

```
food/
-- foodA/
  -- IMG-1.jpg
  -- IMG-2.jpg
  -- IMG-3.jpg
-- foodB/
  -- IMG-1.jpg
  -- IMG-2.jpg
  -- IMG-3.jpg
  ...
```

zip the folder you've just created, open postman or somthing equivelant, add form data field "file" and select your zip file then request with the url:

```
POST: http://localhost:3000/api/classification/upload
```

**Note** the name of the zip file defines also the name of the model, so try to be picky

# Classify data and save the model

```
GET: http://localhost:3000/api/classification/classify?subject=food
```

# Download model

```
GET: http://localhost:3000/api/classification/download?file=food
```
