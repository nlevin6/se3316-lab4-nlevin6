const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const port = 3000;
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const crypto = require('crypto');
const {v4: uuidv4} = require('uuid');

const superheroInfoPath = path.join(__dirname, 'superhero_info.json');
const superheroPowersPath = path.join(__dirname, 'superhero_powers.json');
const superheroListsPath = path.join(__dirname, 'superhero_lists.json');

let superheroLists = [];//all user created lists
let superheroData = [];//all superhero data

const adminUid = 'JzsvhPWP83hSVQab6z8mdpHk8ij2';


function generateRandomId() {
    return crypto.randomBytes(8).toString('hex');
}

fs.readFile(superheroListsPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading superhero_lists.json file:', err);
        return;
    }

    try {
        superheroLists = data ? JSON.parse(data) : [];
    } catch (parseError) {
        console.error('Error parsing superhero_lists.json:', parseError);
        superheroLists = []; // Set superheroLists to an empty array or handle it as needed
    }
});


fs.readFile(superheroInfoPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading superhero_info.json file: ', err);
        return;
    }
    superheroData = JSON.parse(data);
});
app.use(cors({origin: '*'}));
app.use(express.static(path.join(__dirname, '../client/build')));

// Initialize Firebase Admin SDK with service account key
const serviceAccount = require(path.join(__dirname, 'se3316-lab4-nlevin6-firebase-adminsdk-8ji0u-aa1c085f26.json'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Function to decode and verify Firebase JWT token
const decodeUserFromToken = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject('No token provided');
            return;
        }

        admin.auth().verifyIdToken(token)
            .then((decodedToken) => {
                // Check if the user is an admin
                const role = decodedToken.admin === true ? 'admin' : 'user';
                resolve({...decodedToken, role});
            })
            .catch((error) => {
                reject('Invalid token: ' + error.message);
            });
    });
};


module.exports = {
    decodeUserFromToken,
};

// Middleware to extract user information from the JWT token
const extractUserFromToken = async (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    console.log('Received Token:', token);

    try {
        if (token) {
            const user = await decodeUserFromToken(token);

            req.user = {...user, role: user.role || 'user'};
        } else {
            req.user = {role: 'user'};
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        req.user = {role: 'user'};
    }

    next();
};


const createCustomToken = (email) => {
    const claims = {
        admin: email === 'admin@lab4.com',
    };

    return admin.auth().createCustomToken(email, claims);
};

//middleware to do logging
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

//middleware for body parsing for JSON
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if (email === 'admin@lab4.com' && password === 'admin1234') {
        try {
            const customToken = await createCustomToken(email);
            console.log("admin token: " + customToken);
            res.status(200).json({token: customToken});
        } catch (error) {
            console.error('Error creating custom token:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    } else {
        res.status(401).json({error: 'Invalid credentials'});
    }
});

app.get('/superhero/', (req, res) => {
    const superheroName = req.query.name;

    fs.readFile(superheroInfoPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading superhero_info.json file: ', err);
            res.status(500).json({error: 'Error reading superhero_info.json file'});
            return;
        }
        try {
            const allHeroes = JSON.parse(data);

            //find the superhero by name
            const superhero = allHeroes.find(hero => hero.name.toLowerCase() === superheroName.toLowerCase());

            if (superhero) {
                res.json(superhero);
            } else {
                res.status(404).json({message: 'Superhero not found'});
            }
        } catch (error) {
            console.error('Error parsing superhero_info.json:', error);
            res.status(500).json({error: 'Error parsing superhero_info.json'});
        }
    });
});

//this one is being used in the createList component
app.get('/superhero-search', (req, res) => {
    const {query} = req.query;

    if (!query) {
        return res.status(400).json({error: 'Search query is required'});
    }

    fs.readFile(superheroInfoPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading superhero_info.json file: ', err);
            return res.status(500).json({error: 'Error reading superhero_info.json file'});
        }

        try {
            const allHeroes = JSON.parse(data);
            const matchingHeroes = allHeroes.filter(hero => hero.name.toLowerCase().includes(query.toLowerCase()));

            //return only name and publisher
            const searchResults = matchingHeroes.map(hero => ({name: hero.name, Publisher: hero.Publisher}));
            res.json(searchResults);
        } catch (error) {
            console.error('Error parsing superhero_info.json:', error);
            res.status(500).json({error: 'Error parsing superhero_info.json'});
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
            res.status(500).json({error: 'Error reading superhero_info.json file'});
            return;
        }
        fs.readFile(superheroPowersPath, 'utf8', (err, powersData) => {
            if (err) {
                console.error('Error reading superhero_powers.json file: ', err);
                res.status(500).json({error: 'Error reading superhero_powers.json file'});
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
                        res.json(superheroPowers); // Send entire superheroPowers object
                    } else {
                        res.status(404).json({message: 'Superhero powers not found'});
                    }
                } else {
                    res.status(404).json({message: 'Superhero not found'});
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.status(500).json({error: 'Error parsing JSON'});
            }
        });
    });
});


//get publishers
app.get('/publishers', (req, res) => {
    fs.readFile(superheroInfoPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading superhero_info.json file: ', err);
            res.status(500).json({error: 'Error reading superhero_info.json file'});
            return;
        }
        try {
            const heroes = JSON.parse(data);
            const publisherNames = [...new Set(heroes.map(hero => hero.Publisher))];

            res.json({publishers: publisherNames});
        } catch (error) {
            console.error('Error parsing superhero_info.json:', error);
            res.status(500).json({error: 'Error parsing superhero_info.json'});
        }
    });
});

//get the first n number of matching superhero IDs for a given search pattern matching a given information field
app.get('/superhero/search', (req, res) => {
    const {publisher, name, n, race, power} = req.query;
    console.log('Received search request with parameters:', req.query);

    let filteredHeroes = superheroData.filter(hero => {
        const byPublisher = (publisher && publisher !== 'All') ? hero.Publisher.toLowerCase() === publisher.toLowerCase() : true;
        const byName = name ? hero.name.toLowerCase().includes(name.toLowerCase()) : true;
        const byRace = race ? hero.Race && hero.Race.toLowerCase().includes(race.toLowerCase()) : true;
        let byPower = true;

        if (power) {
            const powersData = require('./superhero_powers.json');
            const heroPowers = powersData.find(data => data.hero_names === hero.name) || {};

            byPower = Object.entries(heroPowers)
                .filter(([powerName, powerValue]) => powerName !== 'hero_names')
                .some(([powerName, powerValue]) => powerName.toLowerCase().includes(power.toLowerCase()) && powerValue.toLowerCase() === 'true');
        }

        return byPublisher && byName && byRace && byPower;
    });

    console.log('Filtered superheroes:', filteredHeroes);

    if (filteredHeroes.length === 0) {
        res.status(404).json({message: 'No matching superheroes found'});
    } else {
        const result = filteredHeroes.map(hero => ({
            id: hero.id,
            name: hero.name,
            Gender: hero.Gender,
            'Eye color': hero['Eye color'],
            Race: hero.Race,
            'Hair color': hero['Hair color'],
            Height: hero.Height,
            Publisher: hero.Publisher,
            'Skin color': hero['Skin color'],
            Alignment: hero.Alignment,
            Weight: hero.Weight
        }));

        res.json({matchingSuperheroes: result});
    }
});


app.get('/superhero-lists', extractUserFromToken, (req, res) => {
    const {userId} = req.user;

    res.json({lists: superheroLists.map(list => ({...list, userId}))});
});

app.get('/superhero-lists/:listId', (req, res) => {
    const {listId} = req.params;
    const list = superheroLists.find(list => list.id === listId);
    console.log("backend list ID: " + listId);

    if (list) {
        res.json({list});
    } else {
        res.status(404).json({error: `List with ID "${listId}" not found`});
    }
});


// POST endpoint to create a superhero list
app.post('/superhero-lists', extractUserFromToken, (req, res) => {
    const {listName, description, superheroes, visibility} = req.body;
    const {userId} = req.user;
    console.log("userId in POST request: " + userId);

    const listExists = checkIfListExists(listName, userId);

    if (listExists) {
        return res.status(400).json({error: 'List name already exists'});
    }

    const {listId} = saveSuperheroList(listName, description, visibility, userId, superheroes);

    res.status(200).json({message: 'Superhero list created successfully', listId});
});


function saveSuperheroList(listName, description, visibility, userId, superheroes) {
    // Check if the list name already exists
    if (checkIfListExists(listName, userId)) {
        throw new Error('List name already exists');
    }

    const newListId = generateRandomId();

    const newList = {
        userId,
        id: newListId,
        name: listName,
        description,
        visibility,
        superheroes: superheroes || [],
        ratings: [],
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    superheroLists.push(newList);

    // Save superhero lists to a database here

    fs.writeFile(superheroListsPath, JSON.stringify(superheroLists, null, 2), (err) => {
        if (err) {
            console.error('Error saving superhero lists to file:', err);
            // Handle the error as needed
        } else {
            console.log('Superhero lists saved to file successfully');
        }
    });

    return {listId: newListId};
}


// Update checkIfListExists function to include userId
function checkIfListExists(listName, userId) {
    return superheroLists.some((list) => list.name === listName && list.userId === userId);
}

//update the list with a superhero (POST or PUT)
app.put('/add-to-list', (req, res) => {
    const {superhero, listName} = req.body;

    const selectedList = superheroLists.find(list => list.name === listName);

    if (selectedList) {
        //update the list with the new superhero
        saveSuperheroList(listName, superhero);

        res.status(200).json({message: `${superhero} added to ${listName} successfully`});
    } else {
        res.status(404).json({error: 'List not found'});
    }
});

//fetch superheroes in a selected list
app.get('/fetch-superheroes-in-list', (req, res) => {
    const {listName} = req.query;


    if (listName) {
        const selectedList = superheroLists.find(list => list.name === listName);

        if (selectedList) {
            const superheroes = selectedList.superheroes || [];
            res.status(200).json({superheroes});
        } else {
            res.status(404).json({error: 'List not found'});
        }
    } else {
        res.status(400).json({error: 'List name not provided'});
    }
});

//delete a list of superheroes with a given name
app.delete('/superhero-lists/:id', (req, res) => {
    const {id} = req.params;
    const listIndex = superheroLists.findIndex(list => list.id === id);

    if (listIndex !== -1) {
        // Remove the list from the array
        superheroLists.splice(listIndex, 1);

        // Write the updated superheroLists array back to the JSON file
        fs.writeFile(superheroListsPath, JSON.stringify(superheroLists), (err) => {
            if (err) {
                console.error('Error writing superhero_lists.json file:', err);
                res.status(500).json({error: 'Error updating superhero_lists.json file'});
            } else {
                res.status(200).json({message: `List with ID "${id}" and its contents deleted successfully`});
            }
        });
    } else {
        res.status(404).json({error: `List with ID "${id}" doesn't exist`});
    }
});


app.get('/superhero-lists/:listName', (req, res) => {
    const {listName} = req.params;
    const list = superheroLists.find(list => list.name === listName);
    console.log('Received request for list details. List name:', listName);

    if (list) {
        res.json({list});
    } else {
        res.status(404).json({error: `List "${listName}" not found`});
    }
});


app.put('/superhero-lists/:listId', extractUserFromToken, async (req, res) => {
    const {listId} = req.params;
    const {name, description, visibility, superheroes} = req.body;
    const {userId} = req.user;
    const updateTimestamp = new Date().toISOString();

    try {
        const updatedList = updateSuperheroList(listId, userId, name, description, visibility, superheroes);

        if (updatedList) {
            res.status(200).json({
                message: 'Superhero list updated successfully',
                modifiedAt: updateTimestamp,
            });
        } else {
            res.status(404).json({error: `List with ID "${listId}" not found or unauthorized`});
        }
    } catch (error) {
        console.error('Error updating superhero list:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});


function updateSuperheroList(listId, userId, name, description, visibility, superheroes) {
    const listIndex = superheroLists.findIndex(list => list.id === listId && list.userId === userId);

    if (listIndex !== -1) {
        superheroLists[listIndex].name = name || superheroLists[listIndex].name;
        superheroLists[listIndex].description = description || superheroLists[listIndex].description;
        superheroLists[listIndex].visibility = visibility || superheroLists[listIndex].visibility;
        superheroLists[listIndex].superheroes = superheroes || superheroLists[listIndex].superheroes;
        superheroLists[listIndex].modifiedAt = new Date();

        // Save superhero lists to a database or JSON file here
        fs.writeFile(superheroListsPath, JSON.stringify(superheroLists, null, 2), (err) => {
            if (err) {
                console.error('Error saving superhero lists to file:', err);
            } else {
                console.log('Superhero lists saved to file successfully');
            }
        });

        return superheroLists[listIndex];
    }

    return null;
}

app.post('/superhero-lists/:id/ratings', extractUserFromToken, (req, res) => {
    const {id} = req.params;
    const {userId} = req.user;
    const {rating, comment} = req.body;

    const listIndex = superheroLists.findIndex((list) => list.id === id);

    if (listIndex !== -1) {
        const newRating = {
            id: uuidv4(),
            userId,
            rating,
            comment,
            hidden: false,
        };

        superheroLists[listIndex].ratings.push(newRating);

        // Update superheroLists JSON file
        fs.writeFile(superheroListsPath, JSON.stringify(superheroLists), (err) => {
            if (err) {
                console.error('Error writing superhero_lists.json file:', err);
                res.status(500).json({error: 'Error updating superhero_lists.json file'});
            } else {
                res.status(200).json({message: `Rating added to list with ID "${id}" successfully`});
            }
        });
    } else {
        res.status(404).json({error: `List with ID "${id}" not found`});
    }
});


app.get('/superhero-lists/:id/ratings', (req, res) => {
    const {id} = req.params;
    const list = superheroLists.find(list => list.id === id);
    if (list) {
        res.json(list.ratings);
    } else {
        res.status(404).json({error: `List with ID "${id}" not found`});
    }
});

app.put('/update-user-role', async (req, res) => {
    const { email, role } = req.body;

    try {
        // Get user by email
        const userRecord = await admin.auth().getUserByEmail(email);

        // Update user custom claims using UID
        await admin.auth().setCustomUserClaims(userRecord.uid, { admin: role === 'admin' });

        res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);

        if (error.code === 'auth/user-not-found') {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.get('/get-user-role', async (req, res) => {
const { email } = req.query;

    try {
        // Get user by email
        const userRecord = await admin.auth().getUserByEmail(email);

        // Get user custom claims
        const customClaims = userRecord.customClaims || { admin: false };

        res.status(200).json({ role: customClaims.admin ? 'admin' : 'user' });
    } catch (error) {
        console.error('Error getting user role:', error);

        if (error.code === 'auth/user-not-found') {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});


app.post('/superhero-lists/:listId/ratings/toggle-visibility', async (req, res) => {
    const {listId} = req.params;
    const {ratingId, hidden} = req.body;

    try {
        const listIndex = superheroLists.findIndex((list) => list.id === listId);

        const ratingIndex = superheroLists[listIndex].ratings.findIndex((rating) => rating.id === ratingId);

        if (ratingIndex !== -1) {
            superheroLists[listIndex].ratings[ratingIndex].hidden = hidden;

            if (hidden) {
                superheroLists[listIndex].ratings[ratingIndex].originalComment = superheroLists[listIndex].ratings[ratingIndex].comment;
                superheroLists[listIndex].ratings[ratingIndex].comment = 'Removed by an admin';
            } else {
                superheroLists[listIndex].ratings[ratingIndex].comment = superheroLists[listIndex].ratings[ratingIndex].originalComment;
                delete superheroLists[listIndex].ratings[ratingIndex].originalComment;
            }

            fs.writeFile(superheroListsPath, JSON.stringify(superheroLists), (err) => {
                if (err) {
                    console.error('Error writing superhero_lists.json file:', err);
                    res.status(500).json({error: 'Error updating superhero_lists.json file'});
                } else {
                    res.status(200).json({message: 'Review visibility toggled successfully'});
                }
            });
        } else {
            res.status(404).json({error: `Rating with ID "${ratingId}" not found in list with ID "${listId}"`});
        }
    } catch (error) {
        console.error('Error toggling review visibility:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.get('/getRegisteredEmails', async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers();
        const emails = listUsersResult.users.map((user) => user.email);
        res.json(emails);
    } catch (error) {
        console.error('Error fetching registered emails:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


//port listen message
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
