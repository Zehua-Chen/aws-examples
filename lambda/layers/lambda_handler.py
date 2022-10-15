from models import Request


def lambda_handler(event, context):
    # TODO implement
    r = Request('test user')
    return f'{r}'


if __name__ == "__main__":
    print(lambda_handler(None, None))
