const {faker} = require ('@faker-js/faker');



const randomName = faker.commerce.product();

const randomProducts = new Array(10)

const pushRandomProduct = (arr) => {
    for (let i = 0 ; i < arr.length ; i++) {
        arr[i] = faker.commerce.product()
    }
    return arr;
}

// console.log(pushRandomProduct(randomProducts))

// const randomName = faker.commerce.product();

// const randomProducts = new Array(10)

// const pushRandomProduct = (arr) => {
//     for (let i = 0 ; i < arr.length ; i++) {
//         arr[i] = faker.commerce.product()
//     }
//     return arr;
// }

// console.log(pushRandomProduct(randomProducts))