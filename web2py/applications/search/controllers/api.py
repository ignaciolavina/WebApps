# Here go your api methods.

MY_STRINGS = [
    'banana', 'ananas', 'pineapple', 'anchovie', 'derrian', 'apple', 'apostrophe',
]

@auth.requires_signature(hash_vars=False)
def search():
    products = db(db.product).select()
    s = request.vars.search_string or ''

    res = [t for t in products if s in t.name]

    # res = [t for t in MY_STRINGS if s in t]

    return response.json(dict(strings=res, products=products))
    