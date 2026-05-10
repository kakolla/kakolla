May 9 2026

recap:
- lexer, parser, code generator = compiler

building a lexer: 
- the lexer is pretty straightforward;
- take a giant blob of text, convert it to tokens that the parser can use to build an AST
- lexer(code_input) -> tokens[]
- so, we have to first define the tokens that exist that the lexer can output

since tokens are used by the parser, define the tokens in parser.h

```
struct Token {
    TokenType type;
    std::string token_val; // use a string bc all token types can be represented here, can convert later
}

// define an enum so we can store that 
enum struct TokenType {
    LBrace,
    RBrace,
    Semicolon,
    ...
    KeywordInt,
    EndOfFile

}

```
we also have to prototype a bunch of functions for the parser for later;
- it needs to peek at the next token (this is an LL(1) = look ahead by 1 token parser, so not as advanced)
- it needs to consume/expect the next token, which means accept the token, verify it is the expected/right token, and pop it from the token list
- and then several parse functions for each node type in the AST
```

// token traversal funcs
Token peek(std::vector<Token>& tokens);
Token expect(std::vector<Token>& tokens, TokenType type);

Function* parse_function(std::vector<Token>& tokens);
Block* parse_block(std::vector<Token>& tokens);

Statement* parse_statement(std::vector<Token>& tokens);
Expression* parse_expression(std::vector<Token>& tokens);
Expression* parse_product(std::vector<Token>& tokens);
Expression* parse_factor(std::vector<Token>& tokens);

```

these prototypes and the parser.h file needs to be defined because we need to know what the lexer should output to make sure the parser works correctly.

the parser can now be implemented like so
```
vector<Token> lex(const std::string& program) {
    vector<Token> tokens;
    size_t i = 0;
    while (i < program.size()) {
        char c = program[i];
        // if space, skip
        if (c == ';') {
            // construct the Token struct
            tokens.push_back({TokenType::Semicolon, ";"});

        } else if ...
        
    }
    tokens.push_back({TokenType::EndOfFile, ""});
    return tokens;
}
```

