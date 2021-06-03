#nosetests --exe tests/
from nose.tools import * 
import requests

def test_request_response_no_JWT():
    # Send a request to the API server and store the response.
    response = requests.get('https://7hol8oiuwd.execute-api.us-west-1.amazonaws.com/dev/workspaces')

    # Confirm that the request-response cycle completed unsuccesfully- the API endpoint should have a JWT token!
    assert_equal(response.ok, False)

