"use strict";

let id = 0;
export let dataset = [
    {
        id: id ++,
        name: "Artichoke Pasta",
        category: "mainDishes",
        content: {
            ingredients: [
                ["2", "tablespoons", "butter"],
                ["2", "cloves", "garlic minced"],
                ["1", "cup", "heavy cream"],
                ["3/4", "teaspoon", "salt"],
                ["1", "teaspoon", "fresh-ground black pepper"],
                ["2 1/2", "cups", "canned, drained artichoke hearts (two 14-ounce cans), rinsed and cut into halves or quarters"],
                ["3/4", "pound", "fusilli"],
                ["1/2", "cup", "grated Parmesan cheese"],
                ["2", "tablespoons", "chopped chives, scallion tops, or parsley"]
            ],
            directions: [
                "In a medium saucepan, melt the butter over moderately low heat. Add the garlic and cook for 30 seconds. Stir in the cream, salt, pepper, and artichoke hearts. Cook until just heated through, about 3 minutes.", 
                "In a large pot of boiling, salted water, cook the fusilli until just done, about 13 minutes. Drain the pasta and toss with the cream sauce, Parmesan, and chives."
            ],
            stylePage: {
                backgroundColor: `Bisque`
            },
            styleContent: {
                color: null
            }
        },
        image: {
            backgroundImage: `url("image/artichokepasta.jpg")`,
            backgroundSize: "cover"
        }
    },
    {
        id: id ++,
        name : "Garlic Chicken",
        category: "mainDishes",
        content: {
            ingredients: [
                [3, "tablespoons", "butter"],
                [1, "teaspoon", "seasoning salt"],
                [4, "", "skinless, boneless chicken breast halves"],
                [2, "teaspoons", "garlic powder"]
            ],
            directions: [
                "Melt butter in a large skillet over medium high heat.", 
                "Add chicken and sprinkle with garlic powder, seasoning salt and onion powder.",
                "Saute about 10 to 15 minutes on each side, or until chicken is cooked through and juices run clear."
            ],
            stylePage: {
                backgroundColor: `Azure`
            },
            styleContent: {
                color: null
            }
        },
        image: {
            backgroundImage: `url("image/garlicChicken.webp")`,
            backgroundSize: "cover"
        }
    },
    {
        id: id ++,
        name : "Artichoke Dip",
        category: "mainDishes",
        content: {
            ingredients: [
                ["1 8oz", "package", "soft cream cheese"],
                ["4oz", "", "mayonnaise"],
                ["4oz", "", "sour cream"],
                ["1/4", "Cup", "Fresh Grated Parmesan Cheese"],
                ["1/4", "Cup", "Fresh Grated Romano Cheese"],
                ["2", "", "eggs"],
                ["3/4", "Cup", "dairy sour cream"],
                ["1 16oz", "can", "artichoke hearts"],
                ["1/4", "Cup", "fresh chopped chives"],
                ["1", "tbs ", "fresh minced garlic"]
            ],
            directions: [
                "Soften the cream cheese before mixing.", 
                "Rinse well, then dice the artichokes into small ½” size pieces.",
                "Into a mixing bowl place the softened cream cheese. Mix in the mayonnaise, sour cream, the Parmesan and Romano cheese, artichokes and garlic.",
                "When the mixture is fairly well blended, spoon into a 9” round glass pie dish.",
                "Set Oven to Bake at 350 degrees.",
                "Place un-covered dish into oven for 20 – 25 minutes until the edges appear slightly golden and mixture is bubbling at the edge.",
                "Remove and sprinkle chopped chives on top and let cool about 5 minutes before serving.",
                "Enjoy!"
            ],
            stylePage: {
                backgroundColor: `Wheat`
            },
            styleContent: {
                color: "DarkRed"
            }
        },
        image: {
            backgroundImage: `url("image/artichoke-dip.jpg")`,
            backgroundSize: "cover"
        }
    },
    {
        id: id ++,
        name : "Lime Chicken Tacos",
        category: "mainDishes",
        content: {
            ingredients: [
                ["1 1/2", "pounds", "skinless, boneless chicken breast meat - cubed"],
                ["1/8", "cup", "red wine vinegar"],
                ["1/2", "", "lime, juiced"],
                ["1", "teaspoon", "white sugar"],
                ["1/2", "teaspoon", "salt"],
                ["1/2", "teaspoon", "ground black pepper"],
                ["2", "", "green onions, chopped"],
                ["2", "cloves", "garlic, minced"],
                ["1", "teaspoon", "dried oregano"],
                ["10 (6 inch)", "", "corn tortillas"],
                ["1", "", "tomato, diced"],
                ["1/4", "cup", "shredded lettuce"],
                ["2", "cup", "shredded Monterey Jack chees"],
                ["2", "cup", "salsa"]
            ],
            directions: [
                "Saute chicken in a medium saucepan over medium high heat for about 20 minutes. Add vinegar, lime juice, sugar, salt, pepper, green onion, garlic and oregano. Simmer for an extra 10 minutes.", 
                "Heat an iron skillet over medium heat. Place a tortilla in the pan, warm, and turn over to heat the other side. Repeat with remaining tortillas. Serve lime chicken mixture in warm tortillas topped with tomato, lettuce, cheese and salsa."
            ],
            stylePage: {
                backgroundColor: `YellowGreen`
            },
            styleContent: {
                color: "black"
            }
        },
        image: {
            backgroundImage: `url("image/lime-tacos.jpg")`,
            backgroundSize: "cover"
        }
    },
    {
        id: id ++,
        name : "Easy Chocolate Pie",
        category: "desserts",
        content: {
            ingredients: [
                ["1 (12 ounce)", "can", "evaporated milk"],
                ["1 (5.9 ounce)", "package", "chocolate instant pudding mix"],
                ["1 (6.5 ounce)", "can", "whipped cream"],
                ["1/2", "cup", "miniature semi-sweet chocolate chips (optional)"],
                ["1 (9 inch)", "", "graham cracker pie crust"],
                ["Another", "can", "of whipped cream for garnish (optional)"]
            ],
            directions: [
                "Pour milk into medium bowl. Add dry pudding mix; beat with wire whisk until well blended and mixture just begins to thicken. Stir in half of the chocolate chips.", 
                "Add contents of whipped cream can; stir gently but quickly until well blended. Pour into crust; cover.",
                "Refrigerate 6 hours, or until set. Cut into 8 slices to serve. Garnish with additional whipped cream and remaining chocolate chips, if desired."
            ],
            stylePage: {
                backgroundColor: `Sienna`
            },
            styleContent: {
                color: "AntiqueWhite"
            }
        },
        image: {
            backgroundImage: `url("image/chocolate-pie.jpg")`,
            backgroundSize: "cover"
        }
    },
    {
        id: id ++,
        name : "Roquefort & walnut rolls",
        category: "bakery",
        content: {
            ingredients: [
                ["140", "g", "walnuts"],
                ["100", "g", "wholemeal flour"],
                ["400", "g", "strong white bread flour"],
                ["14", "g", "sachet fast-action yeast"],
                ["25", "g", "butter"],
                ["250", "g", "roquefort cheese, crumbled"],
                ["2", "medium", "eggs, beaten"]
            ],
            directions: [
                "Place the walnuts in a food processor and pulse to chop finely; leave to one side. Put the flours, 10g salt, yeast, butter and 300ml water in a bowl, stir together and begin massaging the ingredients for a minute. If the mixture seems dry, add more water a tbsp at a time to make a soft but not sticky dough, then knead in the bowl for a further couple of minutes to bring the dough together.", 
                "Tip the dough onto a lightly floured work surface and knead well for 10 mins before returning to the bowl. Cover the bowl with cling film and leave to rise in a warm place for 1 hr. Briefly knead the walnuts into the dough, then leave to rise in the bowl for a further 20 mins.",
                "Tip the dough out onto a lightly floured surface and roll out into a rectangle, approx 50 x 20cm, 1cm thick. Sprinkle the Roquefort evenly over the dough and lightly press in. Place the rectangle width-ways in front of you and roll up the rectangle like a Swiss roll. Cut into 8 equal sized pieces and place them onto a lightly greased baking tray, cut-side down. Cover with cling film and leave to rise for 1 hr.",
                "Heat oven to 220C/200C fan/gas 7. Brush each round of dough with the beaten egg and bake for 20 mins. Leave to cool for a few minutes and eat while still warm. These are delicious on their own or served with a soup or a chunky salad with apple in it."
            ],
            stylePage: {
                backgroundColor: `Cornsilk`
            },
            styleContent: {
                color: "DarkRed"
            }
        },
        image: {
            backgroundImage: `url("image/Roquefort-&-walnut-rolls.jpg")`,
            backgroundSize: "cover"
        }
    },
    {
        id: id ++,
        name : "Egyptian egg salad",
        category: "salads",
        content: {
            ingredients: [
                ["2", "large", "eggs"],
                ["1", "juiced", "lemon"],
                ["1", "tbsp", "tahini"],
                ["1", "tbsp", "rapeseed oil"],
                ["1", "chopped", "red onion"],
                ["3", "large, finely chopped", "garlic cloves"],
                ["1", "tsp ground", "cumin"],
                ["1/2", "tsp", "cumin seeds"],
                ["400", "g", "can borlotti or fava beans, juice reserved"],
                ["2", "little gem", "lettuces cut into wedges"],
                ["optional", "sprinkling of dried", "chilli flakes and roughly chopped flat-leaf parsley"]
            ],
            directions: [
                "Bring a pan of water to the boil, lower in the eggs and boil for 8 mins. Drain and run under the cold tap to cool them a little, then peel and halve. Meanwhile, mix 1 tbsp lemon juice and 3 tbsp water with the tahini to make a dressing.",
                "Heat the oil and fry the onion and garlic for 5 mins to soften them. Add the ground cumin and seeds, stir briefly then add the beans and lightly crush some of them as you heat them, adding some of the juice from the can to get a nice creamy consistency but keeping whole beans, too. Taste and add lemon juice and just a little seasoning if you need to.",
                "Spoon the beans on to plates with the lettuce, then add the eggs and tomatoes, with the tahini dressing, chilli and parsley, if using."
            ],
            stylePage: {
                backgroundColor: `GhostWhite`
            },
            styleContent: {
                color: "DarkBlue"
            }
        },
        image: {
            backgroundImage: `url("image/egyptian-egg-salad.jpg")`,
            backgroundSize: "cover"
        }
    },
    {
        id: id ++,
        name : "Spring minestrone",
        category: "soups",
        content: {
            ingredients: [
                ["77g", "pack diced", "pancetta"],
                ["a", "bunch finely sliced", "spring onions"],
                ["1", "bulb, halved and thinly sliced", "fennel"],
                ["2", "cloves, chopped", "garlic"],
                ["1", "litre", "chicken stock"],
                ["2 * 400", "g tins, drained and rinsed", "cannellini beans"],
                ["125", "g", "asparagus tips"],
                ["150", "g, halved lengthways", "sugar snap peas"],
                ["100", "g", "frozen peas"],
                ["125", "g", "baby spinachs"],
                ["50", "g, finely grated, to serve", "parmesan"],
                ["", "to serve", "crusty bread"]
            ],
            directions: [
                "Put the pancetta into a large non-stick pan and cook until crisp and the fat has rendered. Add the spring onions and fennel with some seasoning, and cook gently for 5 minutes until the fennel is beginning to soften.",
                "Add the garlic and cook for 1 minute until fragrant, then pour in the stock and beans. Bring to the boil and simmer for 5 minutes, then add the asparagus tips and sugar snaps, and simmer for another 5 minutes.",
                "Stir in the peas and spinach, and cook for a few minutes until the spinach has wilted, then spoon into bowls, top with parmesan and serve with bread, if you like."
            ],
            stylePage: {
                backgroundColor: `Turquoise`
            },
            styleContent: {
                color: "DarkRed"
            }
        },
        image: {
            backgroundImage: `url("image/three-bean-spring-minestrone.jpg")`,
            backgroundSize: "cover"
        }
    }
],
    newRecipe = {
        id: null,
        name: "My new recipe",
        category: "mainDishes",
        content: {
            ingredients: [],
            directions: [" "],
            stylePage: {
                backgroundColor: `Bisque`
            },
            styleContent: {
                color: null
            }
        },
        image: {
            backgroundImage: `url("image/artichokepasta.jpg")`,
            backgroundSize: "cover"
        }
    }
;