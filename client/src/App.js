import React, { useState, useEffect } from 'react';
import 'client/public/stylesheet.css';

function App() {
    const [searchResults, setSearchResults] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [existingLists, setExistingLists] = useState([]);
    const [selectedListName, setSelectedListName] = useState('');

    useEffect(() => {
        fetchPublishers();
        fetchExistingLists();
    }, []);

    const fetchPublishers = () => {
        fetch('/publishers')
            .then(response => response.json())
            .then(data => setPublishers(['All', ...data.publishers]))
            .catch(error => console.error('Error fetching publishers:', error));
    };

    const searchSuperheroes = async () => {
        try {
            const queryParams = new URLSearchParams({
                publisher,
                name: pattern,
                n: limit,
                race,
                power,
            });

            const response = await fetch(`/superhero/search?${queryParams}`);
            const data = await response.json();

            if (data.message) {
                setSearchResults([data.message]);
            } else {
                const results = data.matchingSuperheroes.map(hero => (
                    <SuperheroContainer
                        key={hero.id}
                        hero={hero}
                        selectedListName={selectedListName}
                        addToSelectedList={addToSelectedList}
                        existingLists={existingLists}
                        handleListSelectChange={handleListSelectChange}
                    />
                ));
                setSearchResults(results);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleListSelectChange = (event) => {
        setSelectedListName(event.target.value);
    };

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

    // Other functions like createList, fetchExistingLists, addToSelectedList, displaySelectedList, and deleteSelectedList can be implemented similarly.
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


    return (
        <div className="App">
            <SearchForm
                publisher={publisher}
                setPublisher={setPublisher}
                pattern={pattern}
                setPattern={setPattern}
                limit={limit}
                setLimit={setLimit}
                race={race}
                setRace={setRace}
                power={power}
                setPower={setPower}
                searchSuperheroes={searchSuperheroes}
            />
            {searchResults}
        </div>
    );
}

export default App;
