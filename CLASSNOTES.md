# Bearer Authentication

- Basic authentication: string based
- Bearer authentication: token based
- String based authentication recieves a string, and our system has to decode the string
- Token based authentication recieves a token, and our system needs to decode the token

1. Our auth process begins with signup and signin: This is basic. -> returns token
2. Once our user has a token, we need to verify the token and pull out any user data: This is bearer.
    1. Token will contain an id tied to the user, as well as any info required for **Authorization**

## JSON Web Token

- A web standard that encodes json into a string
- It protects data passed between two parties
  - It takes a private and/or public key, and uses this as a way to decode your information
- No persisting of token data, only user information hidden behind an encoding
