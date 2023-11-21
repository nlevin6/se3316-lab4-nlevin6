const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const superheroInfoPath = path.join(__dirname, 'superhero_info.json');
const superheroPowersPath = path.join(__dirname, 'superhero_powers.json');

let superheroLists = [];//all user created lists

let superheroData = [];//all superhero data
fs.readFile(superheroInfoPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading superhero_info.json file: ', err);
        return;
    }
    superheroData = JSON.parse(data);
});

//set up serving front-end code
app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

//middleware to do logging
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

//middleware for body parsing for JSON
app.use(bodyParser.json());

app.get('/superhero/', (req, res) => {
    const superheroName = req.query.name; //extract the hero name

    fs.readFile(superheroInfoPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading superhero_info.json file: ', err);
            res.status(500).json({ error: 'Error reading superhero_info.json file' });
            return;
        }
        try {
            const allHeroes = JSON.parse(data);

            //find the superhero by name
            const superhero = allHeroes.find(hero => hero.name.toLowerCase() === superheroName.toLowerCase());

            if (superhero) {
                res.json(superhero); //send superhero information as JSON response
            } else {
                res.status(404).json({ message: 'Superhero not found' });
            }
        } catch (error) {
            console.error('Error parsing superhero_info.json:', error);
            res.status(500).json({ error: 'Error parsing superhero_info.json' });
        }
    });
});

//ugly json format only
//USAGE EXAMPLE: http://localhost:3000/superhero/0/powers. Will give powers for hero with id 0
app.get('/superhero/:id/powers', (req, res) => {
    const superheroID = req.params.id;

    fs.readFile(superheroInfoPath, 'utf8', (err, infoData) => {
        if (err) {
            console.error('Error reading superhero_info.json file: ', err);
            res.status(500).json({ error: 'Error reading superhero_info.json file' });
            return;
        }
        fs.readFile(superheroPowersPath, 'utf8', (err, powersData) => {
            if (err) {
                console.error('Error reading superhero_powers.json file: ', err);
                res.status(500).json({ error: 'Error reading superhero_powers.json file' });
                return;
            }

            try {
                const heroInfo = JSON.parse(infoData);
                const heroPowers = JSON.parse(powersData);

                // Find superhero's name based on the ID
                const superhero = heroInfo.find(hero => hero.id === parseInt(superheroID));

                if (superhero) {
                    // Find powers based on the superhero name
                    const superheroPowers = heroPowers.find(hero => hero.hero_names === superhero.name);

                    if (superheroPowers) {
                        res.json(superheroPowers); // Send superhero powers as a JSON response
                    } else {
                        res.status(404).json({ message: 'Superhero powers not found' });
                    }
                } else {
                    res.status(404).json({ message: 'Superhero not found' });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.status(500).json({ error: 'Error parsing JSON' });
            }
        });
    });
});

//get publishers
app.get('/publishers', (req, res) => {
    fs.readFile(superheroInfoPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading superhero_info.json file: ', err);
            res.status(500).json({ error: 'Error reading superhero_info.json file' });
            return;
        }
        try {
            const heroes = JSON.parse(data);
            const publisherNames = [...new Set(heroes.map(hero => hero.Publisher))];

            res.json({ publishers: publisherNames });
        } catch (error) {
            console.error('Error parsing superhero_info.json:', error);
            res.status(500).json({ error: 'Error parsing superhero_info.json' });
        }
    });
});

//get the first n number of matching superhero IDs for a given search pattern matching a given information field
app.get('/superhero/search', (req, res) => {
    const { publisher, name, n, race, power } = req.query;

    let filteredHeroes = superheroData.filter(hero => {
        const byPublisher = (publisher && publisher !== 'All') ? hero.Publisher.toLowerCase() === publisher.toLowerCase() : true;
        const byName = name ? hero.name.toLowerCase().includes(name.toLowerCase()) : true;
        const byRace = race ? hero.Race.toLowerCase() === race.toLowerCase() : true;
        let byPower = true;

        //im keeping this case sensitive. too much work to make it not case sensitive. still works though
        if (power) {
            const powersData = require('./superhero_powers.json');
            const heroPowers = powersData.find(data => data.hero_names === hero.name);

            byPower = heroPowers && heroPowers[power] === "True";
        }

        return byPublisher && byName && byRace && byPower;
    });

    if (filteredHeroes.length === 0) {
        res.status(404).json({ message: 'No matching superheroes found' });
    } else {
        let result = filteredHeroes;
        if (n && parseInt(n) > 0) {
            result = filteredHeroes.slice(0, parseInt(n));
        }
        res.json({ matchingSuperheroes: result });
    }
});

app.get('/superhero-lists', (req, res) => {
    res.json({ lists: superheroLists });
});

//request to create a new superhero list (POST)
app.post('/superhero-lists', (req, res) => {
    const { listName } = req.body; //get list name from request body
    
    const listExists = checkIfListExists(listName);

    if (listExists) {
        return res.status(400).json({ error: 'List name already exists' });
    }

    saveSuperheroList(listName);

    res.status(200).json({ message: 'Superhero list created successfully' });
});

function checkIfListExists(listName) {
  return superheroLists.some(list => list.name === listName);
}

function saveSuperheroList(listName) {
  if (checkIfListExists(listName)) {
    throw new Error('List name already exists');
  }

  //save the list
  superheroLists.push({ name: listName });
}

function saveSuperheroList(listName, superhero) {
    //check if the list already exists
    const existingList = superheroLists.find(list => list.name === listName);
  
    if (existingList) {
      existingList.superheroes.push(superhero);
    } else {
      //create a new list with the superhero
      superheroLists.push({ name: listName, superheroes: [superhero] });
    }
  }
  
  //update the list with a superhero (POST or PUT)
  app.put('/add-to-list', (req, res) => {
    const { superhero, listName } = req.body;
  
    const selectedList = superheroLists.find(list => list.name === listName);
  
    if (selectedList) {
      //update the list with the new superhero
      saveSuperheroList(listName, superhero);
  
      res.status(200).json({ message: `${superhero} added to ${listName} successfully` });
    } else {
      res.status(404).json({ error: 'List not found' });
    }
  });
  
  //fetch superheroes in a selected list
  app.get('/fetch-superheroes-in-list', (req, res) => {
    const { listName } = req.query;
  
    if (listName) {
      const selectedList = superheroLists.find(list => list.name === listName);
  
      if (selectedList) {
        const superheroes = selectedList.superheroes || [];
        res.status(200).json({ superheroes });
      } else {
        res.status(404).json({ error: 'List not found' });
      }
    } else {
      res.status(400).json({ error: 'List name not provided' });
    }
  });

//delete a list of superheroes with a given name
app.delete('/superhero-lists/:listName', (req, res) => {
    const { listName } = req.params;
    const listIndex = superheroLists.findIndex(list => list.name === listName);

    if (listIndex !== -1) {
        superheroLists.splice(listIndex, 1);
        res.status(200).json({ message: `List "${listName}" and its contents deleted successfully` });
    } else {
        res.status(404).json({ error: `List "${listName}" doesn't exist` });
    }
});


//port listen message
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
