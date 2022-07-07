myObj = {
    name: "Donovan",
    valueFunc: testFunc
}

function testFunc () {
    console.log('Worked!')
}

function runner (theObj) {
    theObj.valueFunc()
}


runner(myObj)


// ---------------------------------------------------------------------------

dbFacts = [
    {
        factTitle: "TOTAL ITEMS",
        factValueFunc: "placeholder"
    },
    {
        factTitle: "TOTAL VALUE",
        factValueFunc: "placeholder"
    },
    {
        factTitle: "MOST IN STOCK",
        factValueFunc: "placeholder"
    },
    {
        factTitle: "LEAST IN STOCK",
        factValueFunc: "placeholder"
    }
]


dbFacts.forEach(function (item, index) {
    console.log(item.factTitle);

  });