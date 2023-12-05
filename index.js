//source: https://stackoverflow.com/questions/41654006/numpy-random-choice-in-javascript
function randomChoice(p) {
    var rnd = p.reduce(function (a, b) {
        return a + b;
    }) * Math.random();
    return p.findIndex(function (a) {
        return (rnd -= a) <0;
    });
}

var loadModel = _.once(function() {
    return tf.loadLayersModel("data/model/model.json", false);
})


jQuery(document).ready(function($) {
    var recipeElement = $("#robot-recipe");
    
    $("#recipe-generate").click(function() {
        recipeElement.text("Schaue im Rezeptbuch nach...");

        loadModel().then(function(model) {
            var text = [];

            var generate = function(i) {
                if (i > 400) {
                    return;
                }
                tf.tidy(function() {
                    var prediction = model.predict(tf.tensor2d(input, [1,40]));
        
                    var data = prediction.dataSync();
                    var wordIndex = randomChoice(data);
                    input.push(wordIndex);
                    input.shift();
        
                    //if(words[wordIndex].length > 1 || words[wordIndex].match("[A-Za-z\$0-9")) {
                    //    text.push(" ");
                    //}
                    text.push(words[wordIndex]);
                    recipeElement.text(text.join(" "));
                })
                setTimeout(function() {
                    generate(i+1)
                }, 1);
                
            }


            var input = [933,5112,1058,4846,5949,5743,3665,20,2158,5420,
                2684,4993,5743,3896,4326,20,921,630,4988,4176,1058,5634,
                10,3923,621,3764,6162,4128,20,933,1058,4988,4176,2386,
                4574,5743,5233,4148,5079,3366];

            
            generate(0);
            
        })
    });
})
