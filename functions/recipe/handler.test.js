const exctractList = (./extractList)

var data [ { title: 'Chicken Vesuvio',
        img:
         'https://www.edamam.com/web-img/e42/e42f9119813e890af34c259785ae1cfb.jpg',
        ingredients:
         [ '1/2 cup olive oil',
           '5 cloves garlic, peeled',
           '2 large russet potatoes, peeled and cut into chunks',
           '1 3-4 pound chicken, cut into 8 pieces (or 3 pound chicken legs)',
           '3/4 cup white wine',
           '3/4 cup chicken stock',
           '3 tablespoons chopped parsley',
           '1 tablespoon dried oregano',
           'Salt and pepper',
           '1 cup frozen peas, thawed' ] },
      { title: 'Chicken Paprikash',
        img:
         'https://www.edamam.com/web-img/e12/e12b8c5581226d7639168f41d126f2ff.jpg',
        ingredients:
         [ '640 grams chicken - drumsticks and thighs ( 3 whole chicken legs cut apart)',
           '1/2 teaspoon salt',
           '1/4 teaspoon black pepper',
           '1 tablespoon butter – cultured unsalted (or olive oil)',
           '240 grams onion sliced thin (1 large onion)',
           '70 grams Anaheim pepper chopped (1 large pepper)',
           '25 grams paprika (about 1/4 cup)',
           '1 cup chicken stock',
           '1/2 teaspoon salt',
           '1/2 cup sour cream',
           '1 tablespoon flour – all-purpose' ] },
      { title: 'Chicken Gravy',
        img:
         'https://www.edamam.com/web-img/fd1/fd1afed1849c44f5185720394e363b4e.jpg',
        ingredients:
         [ '4 cups chicken bones and wings',
           '2 tablespoons unsalted butter, softened',
           '2 tablespoons all-purpose flour',
           '4 cups homemade bruce and eric bromberg\'s chicken stock, or store-bought low-sodium chicken stock',
           '1 tablespoon fresh thyme leaves',
           'Coarse salt and freshly ground black pepper' ] },
      { title: 'Catalan Chicken',
        img:
         'https://www.edamam.com/web-img/4d9/4d9084cbc170789caa9e997108b595de.jpg',
        ingredients:
         [ '1 whole 4-pound chicken, quartered',
           '8 slices bacon',
           '30 cloves garlic',
           '3 lemons, peeled, rinds thinly sliced and reserved',
           '½ cup Banyuls or another fortified dessert wine',
           '1 cup veal or chicken stock' ] } ]

test('Extracts parameters' , () => {
    expect(getRecipes).toEqual(data)
});