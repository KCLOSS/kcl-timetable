const {readFileSync, writeFileSync} = require('fs');

let v = JSON.parse(readFileSync('response.2.json'));
v[0].ResourceEvents.sort((a, b) => new Date(a.StartDateTime) - new Date(b.StartDateTime));

// writeFileSync('response.2.json', JSON.stringify(v));
// v[0].ResourceEvents.forEach(x => console.log(`${x.StartDateTime}: ${x.Description}`));
console.log(v[0].ResourceEvents.length);
