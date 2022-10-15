# Layers

## Upload to AWS

1. Create a Lambda with [`lambda_handler.py`](lambda_handler.py)
2. Add [`python`](python/) folder to a zip file
3. Upload zip as layer to AWS Lambda and associate layer with the Lambda

## Local Development

1. Go to [`python`](python/) and run `pip install -e .`
2. Open [`lambda_handler.py`](lambda_handler.py)
