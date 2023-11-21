document.getElementById('searchButton').addEventListener('click', searchSuperheroes);

function searchSuperheroes() {
    const publisher = document.getElementById('publisher').value;
    const pattern = document.getElementById('pattern').value;
    const limit = document.getElementById('limit').value;
    const race = document.getElementById('race').value;
    const power = document.getElementById('power').value;

    const queryParams = new URLSearchParams({
        publisher,
        name: pattern,
        n: limit,
        race,
        power
    });

    fetch(`/superhero/search?${queryParams}`)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = '<h2>Matching Superheroes:</h2>';

            if (data.message) {
                searchResults.textContent = data.message;
            } else {
                data.matchingSuperheroes.forEach(hero => {
                    const superheroContainer = document.createElement('div');
                    superheroContainer.classList.add('superhero-container');
                    const superheroInfo = document.createElement('div');
                    superheroInfo.classList.add('superhero-info');
                    superheroInfo.innerHTML = `
                        <h3>${hero.name}</h3>
                        ${Object.entries(hero)
                            .filter(([key]) => key !== 'id' && key !== 'name')//dont show these fields
                            .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                            .join('')}
                    `;
                    superheroContainer.appendChild(superheroInfo);

                    searchResults.appendChild(superheroContainer); //append the hero info before fetching powers


                    const addToListButton = document.createElement('button');
                    addToListButton.textContent = 'Add to List';

                    const listSelect = document.createElement('select');
                    listSelect.id = `listSelect-${hero.id}`; // Unique ID for each superhero
                    listSelect.innerHTML = ''; // Clear existing options

                    fetch('/superhero-lists')
                        .then(response => response.json())
                        .then(data => {
                            data.lists.forEach(list => {
                                const option = document.createElement('option');
                                option.value = list.name;
                                option.textContent = list.name;
                                listSelect.appendChild(option);
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching lists:', error);
                        });

                    addToListButton.addEventListener('click', () => {
                        const selectedList = listSelect.value;
                        addToSelectedList(hero.name, selectedList);
                    });

                    superheroContainer.appendChild(addToListButton);
                    superheroContainer.appendChild(listSelect);
                    searchResults.appendChild(superheroContainer);
                    fetch(`/superhero/${hero.id}/powers`)
                        .then(response => response.json())
                        .then(powersData => {
                            const superheroPowers = document.createElement('div');
                            superheroPowers.classList.add('superhero-powers');
                            superheroPowers.innerHTML = '<h3>Powers:</h3>';

                            if (powersData.message) {
                                superheroPowers.textContent = powersData.message;
                            } else {
                                Object.entries(powersData).forEach(([key, value]) => {
                                    if (value === 'True') {
                                        superheroPowers.innerHTML += `<p>${key}</p>`;
                                    }
                                });
                            }

                            superheroContainer.appendChild(superheroPowers); //append powers after fetching them
                        })
                        .catch(error => {
                            console.error('Error fetching superhero powers:', error);
                        });
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

//fetch the publisher names
function populatePublisherDropdown() {
    fetch('/publishers')
        .then(response => response.json())
        .then(data => {
            data.publishers.sort();

            const publisherDropdown = document.getElementById('publisher');
            const allOption = document.createElement('option');//add an All option
            allOption.value = 'All';
            allOption.textContent = 'All';
            publisherDropdown.appendChild(allOption);

            data.publishers.forEach(publisher => {
                if (publisher.trim() !== '') { //if the publisher is not blank
                    const option = document.createElement('option');
                    option.value = publisher;
                    option.textContent = publisher;
                    publisherDropdown.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error:', error));
}
populatePublisherDropdown();//call it to populate the dropdown menu

// Function to create a new list
function createList() {
    const listName = document.getElementById('listName').value;

    fetch('/superhero-lists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listName })
    })
        .then(response => {
            if (response.ok) {
                console.log('List created successfully');
                //all actions for when the function works successfully go in here
                fetchExistingLists();
            } else {
                alert("List already exists");
                console.error('Failed to create list');
            }
        })
        .catch(error => {
            console.error('Error creating list:', error);
        });
}

function fetchExistingLists() {
    fetch('/superhero-lists')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const existingLists = document.getElementById('existingLists');
            existingLists.innerHTML = ''; //clear existing dropdown options

            //add default option
            const defaultOption = document.createElement('option');
            defaultOption.text = 'Select a List';
            existingLists.add(defaultOption);

            //add other list options made by the user
            data.lists.forEach(list => {
                const option = document.createElement('option');
                option.value = list.name;
                option.textContent = list.name;
                existingLists.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching existing lists:', error);
        });
}


//fetch existing lists when the page loads
window.onload = fetchExistingLists;


function addToSelectedList(superheroName, listName) {
    fetch('/add-to-list', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ superhero: superheroName, listName })
    })
        .then(response => {
            if (response.ok) {
                console.log(`${superheroName} added to ${listName} successfully`);
            } else {
                console.error(`Failed to add ${superheroName} to ${listName}`);
            }
        })
        .catch(error => {
            console.error('Error adding to list:', error);
        });
}

//function to fetch and display superheroes in a selected list
function displaySelectedList() {
    const selectedListName = document.getElementById('existingLists').value;
    const selectedSuperheroesList = document.getElementById('selectedSuperheroesList');

    if (selectedListName) {
        fetch(`/fetch-superheroes-in-list?listName=${selectedListName}`)
            .then(response => response.json())
            .then(data => {
                selectedSuperheroesList.innerHTML = `<h2>Superheroes in ${selectedListName}:</h2>`;

                if (data.error) {
                    selectedSuperheroesList.textContent = data.error;
                } else {
                    data.superheroes.forEach(superheroName => {
                        if (superheroName !== undefined) {
                            fetch(`/superhero/?name=${superheroName}`)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Superhero information not found');
                                    }
                                    return response.json();
                                })
                                .then(superheroData => {
                                    fetch(`/superhero/${superheroData.id}/powers`)
                                        .then(response => response.json())
                                        .then(powersData => {
                                            const superheroContainer = document.createElement('div');
                                            superheroContainer.classList.add('superhero-container');

                                            const superheroInfo = document.createElement('div');
                                            superheroInfo.classList.add('superhero-info');
                                            superheroInfo.innerHTML = `
                          <h3>${superheroData.name}</h3>
                          ${Object.entries(superheroData)
                                                    .filter(([key]) => key !== 'id' && key !== 'name')
                                                    .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                                                    .join('')}
                        `;

                                            superheroContainer.appendChild(superheroInfo);

                                            const superheroPowers = document.createElement('div');
                                            superheroPowers.classList.add('superhero-powers');
                                            superheroPowers.innerHTML = '<h4>Powers:</h4>';

                                            Object.entries(powersData).forEach(([key, value]) => {
                                                if (value === 'True') {
                                                    superheroPowers.innerHTML += `<p>${key}</p>`;
                                                }
                                            });

                                            superheroContainer.appendChild(superheroPowers);
                                            selectedSuperheroesList.appendChild(superheroContainer);
                                        })
                                        .catch(error => console.error('Error fetching superhero powers:', error));
                                })
                                .catch(error => console.error('Error fetching superhero details:', error));
                        }
                    });
                }
            })
            .catch(error => console.error('Error fetching superheroes in list:', error));
    }
}

function deleteSelectedList() {
    const selectedListName = document.getElementById('existingLists').value;

    fetch(`/superhero-lists/${selectedListName}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log(`List "${selectedListName}" deleted successfully`);

            const existingLists = document.getElementById('existingLists');

            // Remove the list from the dropdown if it was selected
            if (existingLists.value === selectedListName) {
                existingLists.remove(existingLists.selectedIndex);
                // Clear the displayed superheroes if the deleted list was being shown
                const selectedSuperheroesList = document.getElementById('selectedSuperheroesList');
                selectedSuperheroesList.innerHTML = '';
            }
        } else {
            console.error(`Failed to delete list "${selectedListName}"`);
        }
    })
    .catch(error => {
        console.error('Error deleting list:', error);
    });
}


