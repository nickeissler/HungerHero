import React, {
  useState, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  Navbar, Container,
} from 'react-bootstrap';
import {
  LineChart,
  ResponsiveContainer,
  Legend, Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import './App.css';

const apiModule = require('./api');

function DonationsComponent({ user }) {
  const newDonation = useRef(false);
  const [, setNewDonation] = useState(false);
  const newColDonor = useRef('');
  const newColDate = useRef('');
  const newColDescription = useRef('');
  const newColValue = useRef('');

  // for mocking purposes
  const deletion_made = useRef(false);
  const [, setDeletionMade] = useState(false);
  const addition_made = useRef(false);
  const [, setAdditionMade] = useState(false);

  function handleNewCollection() {
    newDonation.current = true;
    setNewDonation(true);
  }

  function handleDeleteCollection() {
    deletion_made.current = true;
    setDeletionMade(true);
  }

  function handleChooseDonation(e) {
    e.preventDefault();
  }

  function handleReturnHome() {
    viewDonations.current = false;
    setViewDonations(false);
    newDonation.current = false;
    setNewDonation(false);
  }

  function handleOnChangeDonor(e) {
    newColDonor.current = e.target.value;
  }

  function handleOnChangeDate(e) {
    newColDate.current = e.target.value;
  }

  function handleOnChangeDescription(e) {
    newColDescription.current = e.target.value;
  }

  function handleOnChangeDollarValue(e) {
    newColValue.current = e.target.value;
  }

  async function handlePostCollection() {
    console.log('Donor');
    console.log(newColDonor.current);
    console.log('Date');
    console.log(newColDate.current);
    console.log('Description');
    console.log(newColDescription.current);
    console.log('Value');
    console.log(newColValue.current);

    try {
      await apiModule.addDonation(newColDonor.current, user.username, newColDate.current, newColDescription.current, newColValue.current);
    } catch (err) {
      throw new Error('could not add new donation');
    }
    newDonation.current = false;
    setNewDonation(false);
    addition_made.current = true;
    setAdditionMade(true);
  }

  const donationsList = [{
    organization: "People's Emergency Center Food Pantry", date: '2/12/2022', description: '20 cans of beans, 20 potatoes', value: 20,
  },
  {
    organization: 'Salvation Army West Philadelphia Corps', date: '3/2/2022', description: '20 ears of corn and 30 apples', value: 15,
  },
  {
    organization: 'Saint Ignacious of Loyola Food Pantry', date: '4/7/22', description: 'Hamburger meet', value: 30,
  },
  {
    organization: 'United Communities Southeast Philadelphia Food Pantry', date: '4/15/22', description: 'Loaves of bread', value: 35,
  }];

  const totalDonationsGiven = useRef(0);
  const totalDonationsValue = useRef(100);

  const collectionsList = [{
    donor: 'NickEiss', date: '3/22/2022', description: 'Various fruits and vegetables', value: 55,
  },
  {
    donor: 'MaxFlynn', date: '12/4/2021', description: 'Chicken Noodle Soup Cans', value: 15,
  },
  {
    donor: 'Cornell_22', date: '12/1/2021', description: 'Loaves of bread', value: 25,
  },
  {
    donor: 'Kearney_foods', date: '11/27/2021', description: 'Chicken breasts', value: 30,
  }];

  const totalCollectionsReceived = useRef(0);
  const totalCollectionsValue = useRef(125);

  const pdata1 = [
    {
      date: donationsList[0].date,
      value: donationsList[0].value,
    },
    {
      date: donationsList[1].date,
      value: donationsList[1].value,
    },
    {
      date: donationsList[2].date,
      value: donationsList[2].value,
    },
    {
      date: donationsList[3].date,
      value: donationsList[3].value,
    },
  ];

  const pdata2 = [
    {
      date: collectionsList[0].date,
      value: collectionsList[0].value,
    },
    {
      date: collectionsList[1].date,
      value: collectionsList[1].value,
    },
    {
      date: collectionsList[2].date,
      value: collectionsList[2].value,
    },
    {
      date: collectionsList[3].date,
      value: collectionsList[3].value,
    },
  ];

  const pdata2_2 = [
    {
      date: collectionsList[1].date,
      value: collectionsList[1].value,
    },
    {
      date: collectionsList[2].date,
      value: collectionsList[2].value,
    },
    {
      date: collectionsList[3].date,
      value: collectionsList[3].value,
    },
  ];

  const pdata2_3 = [
    {
      date: '12/25/2019',
      value: '15',
    },
    {
      date: collectionsList[1].date,
      value: collectionsList[1].value,
    },
    {
      date: collectionsList[2].date,
      value: collectionsList[2].value,
    },
    {
      date: collectionsList[3].date,
      value: collectionsList[3].value,
    },
  ];

  async function getDonors() {
    try {
      const dList = await apiModule.getDonationsWithCollector(user.username);
      console.log('dList');
      console.log(dList);
    } catch (err) {
      console.log('could not get donations');
    }
  }

  // <Maps />
  if (newDonation.current) {
    return (
      <div className="mainform">
        <p>Please Enter Collection Information</p>
        <p>Donor Username</p>
        <div>
          <input type="text" onChange={handleOnChangeDonor} />
        </div>
        <p>Date</p>
        <div>
          <input type="text" onChange={handleOnChangeDate} />
        </div>
        <p>Description</p>
        <div>
          <input type="text" onChange={handleOnChangeDescription} />
        </div>
        <p>Dollar Value</p>
        <div>
          <input type="text" onChange={handleOnChangeDollarValue} />
        </div>
        <button type="submit" onClick={handlePostCollection}>Post Collection</button>
      </div>
    );
  }
  if (user.type === 'donor') {
    for (var i = 0; i < donationsList.length; i++) {
      totalDonationsGiven.current += 1;
    }

    return (
      <div className="./App.css/maindiv">
        <h1>Hunger Hero</h1>
        <h6>
          UserName:
          {' '}
          {user.username}
          {' '}
          Account Type:
          {' '}
          {user.type}
        </h6>
        <h6>
          {' '}
        </h6>
        <h6>
          {' '}
        </h6>
        <h6>
          <br />
        </h6>
        <h6>Recent Donations</h6>
        <h6>
          Organization:
          {' '}
          {donationsList[0].organization}
          {' | '}
          Date:
          {' '}
          {donationsList[0].date}
          {' | '}
          Description:
          {' '}
          {donationsList[0].description}
          {' | '}
          Dollar Value:
          {' $'}
          {donationsList[0].value}
          {' | '}
          <button type="submit" onClick={handleChooseDonation}>Message</button>
        </h6>
        <h6>
          Organization:
          {' '}
          {donationsList[1].organization}
          {' | '}
          Date:
          {' '}
          {donationsList[1].date}
          {' | '}
          Description:
          {' '}
          {donationsList[1].description}
          {' | '}
          Dollar Value:
          {' $'}
          {donationsList[1].value}
          {' | '}
          <button type="submit" onClick={handleChooseDonation}>Message</button>
        </h6>
        <h6>
          Organization:
          {' '}
          {donationsList[2].organization}
          {' | '}
          Date:
          {' '}
          {donationsList[2].date}
          {' | '}
          Description:
          {' '}
          {donationsList[2].description}
          {' | '}
          Dollar Value:
          {' $'}
          {donationsList[2].value}
          {' | '}
          <button type="submit" onClick={handleChooseDonation}>Message</button>
        </h6>
        <h6>
          Organization:
          {' '}
          {donationsList[3].organization}
          {' | '}
          Date:
          {' '}
          {donationsList[3].date}
          {' | '}
          Description:
          {' '}
          {donationsList[3].description}
          {' | '}
          Dollar Value:
          {' $'}
          {donationsList[3].value}
          {' | '}
          <button type="submit" onClick={handleChooseDonation}>Message</button>
          <br />
        </h6>
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart data={pdata1} margin={{ right: 50 }}>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              interval="preserveStartEnd"
            />
            <YAxis />
            <Legend />
            <Tooltip />
            <Line
              dataKey="value"
              stroke="red"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <h6>
          Total Donations Given:
          {totalDonationsGiven.current}
          {' | '}
          Total Donations Dollar Value:
          $
          {totalDonationsValue.current}
        </h6>
        <h6>
          <button type="submit" onClick={handleReturnHome}>Return Home</button>
        </h6>
      </div>
    );
  }
  getDonors();

  for (var i = 0; i < collectionsList.length; i++) {
    totalCollectionsReceived.current += 1;
  }
  if (deletion_made.current) {
    if (addition_made.current) {
      return (
        <div className="./App.css/maindiv">
          <h1>Hunger Hero</h1>
          <h6>
            UserName:
            {' '}
            {user.username}
            {' '}
            Account Type:
            {' '}
            {user.type}
          </h6>
          <h6>
            <br />
          </h6>
          <h6>
            <button type="submit" onClick={handleNewCollection}>Log New Collection</button>
          </h6>
          <h6>
            <br />
          </h6>
          <h6>Recent Collections</h6>
          <h6>
            Donor:
            {' '}
            newdonor
            {' | '}
            Date:
            {' '}
            12/25/2019
            {' | '}
            Description:
            {' '}
            meat and potatoes
            {' | '}
            Dollar Value:
            {' $'}
            15
            {' | '}
            <button type="submit" onClick={handleChooseDonation}>Message</button>
            <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
          </h6>
          <h6>
            Donor:
            {' '}
            {collectionsList[1].donor}
            {' | '}
            Date:
            {' '}
            {collectionsList[1].date}
            {' | '}
            Description:
            {' '}
            {collectionsList[1].description}
            {' | '}
            Dollar Value:
            {' $'}
            {collectionsList[1].value}
            {' | '}
            <button type="submit" onClick={handleChooseDonation}>Message</button>
            <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
          </h6>
          <h6>
            Donor:
            {' '}
            {collectionsList[2].donor}
            {' | '}
            Date:
            {' '}
            {collectionsList[2].date}
            {' | '}
            Description:
            {' '}
            {collectionsList[2].description}
            {' | '}
            Dollar Value:
            {' $'}
            {collectionsList[2].value}
            {' | '}
            <button type="submit" onClick={handleChooseDonation}>Message</button>
            <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
          </h6>
          <h6>
            Donor:
            {' '}
            {collectionsList[3].donor}
            {' | '}
            Date:
            {' '}
            {collectionsList[3].date}
            {' | '}
            Description:
            {' '}
            {collectionsList[3].description}
            {' | '}
            Dollar Value:
            {' $'}
            {collectionsList[3].value}
            {' | '}
            <button type="submit" onClick={handleChooseDonation}>Message</button>
            <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
            <br />
          </h6>
          <ResponsiveContainer width="100%" aspect={3}>
            <LineChart data={pdata2_3} margin={{ right: 50 }}>
              <CartesianGrid />
              <XAxis
                dataKey="date"
                interval="preserveStartEnd"
              />
              <YAxis />
              <Legend />
              <Tooltip />
              <Line
                dataKey="value"
                stroke="red"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <h6>
            Total Collections Received:
            {totalCollectionsReceived.current}
            {' | '}
            Total Collections Dollar Value:
            $
            {totalCollectionsValue.current}
          </h6>
          <h6>
            <button type="submit" onClick={handleReturnHome}>Return Home</button>
          </h6>
        </div>
      );
    }
    return (
      <div className="./App.css/maindiv">
        <h1>Hunger Hero</h1>
        <h6>
          UserName:
          {' '}
          {user.username}
          {' '}
          Account Type:
          {' '}
          {user.type}
        </h6>
        <h6>
          <br />
        </h6>
        <h6>
          <button type="submit" onClick={handleNewCollection}>Log New Collection</button>
        </h6>
        <h6>
          <br />
        </h6>
        <h6>Recent Collections</h6>
        <h6>
          Donor:
          {' '}
          {collectionsList[1].donor}
          {' | '}
          Date:
          {' '}
          {collectionsList[1].date}
          {' | '}
          Description:
          {' '}
          {collectionsList[1].description}
          {' | '}
          Dollar Value:
          {' $'}
          {collectionsList[1].value}
          {' | '}
          <button type="submit" onClick={handleChooseDonation}>Message</button>
          <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
        </h6>
        <h6>
          Donor:
          {' '}
          {collectionsList[2].donor}
          {' | '}
          Date:
          {' '}
          {collectionsList[2].date}
          {' | '}
          Description:
          {' '}
          {collectionsList[2].description}
          {' | '}
          Dollar Value:
          {' $'}
          {collectionsList[2].value}
          {' | '}
          <button type="submit" onClick={handleChooseDonation}>Message</button>
          <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
        </h6>
        <h6>
          Donor:
          {' '}
          {collectionsList[3].donor}
          {' | '}
          Date:
          {' '}
          {collectionsList[3].date}
          {' | '}
          Description:
          {' '}
          {collectionsList[3].description}
          {' | '}
          Dollar Value:
          {' $'}
          {collectionsList[3].value}
          {' | '}
          <button type="submit" onClick={handleChooseDonation}>Message</button>
          <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
          <br />
        </h6>
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart data={pdata2_2} margin={{ right: 50 }}>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              interval="preserveStartEnd"
            />
            <YAxis />
            <Legend />
            <Tooltip />
            <Line
              dataKey="value"
              stroke="red"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <h6>
          Total Collections Received:
          {totalCollectionsReceived.current}
          {' | '}
          Total Collections Dollar Value:
          $
          {totalCollectionsValue.current}
        </h6>
        <h6>
          <button type="submit" onClick={handleReturnHome}>Return Home</button>
        </h6>
      </div>
    );
  }

  return (
    <div className="./App.css/maindiv">
      <h1>Hunger Hero</h1>
      <h6>
        UserName:
        {' '}
        {user.username}
        {' '}
        Account Type:
        {' '}
        {user.type}
      </h6>
      <h6>
        <br />
      </h6>
      <h6>
        <button type="submit" onClick={handleNewCollection}>Log New Collection</button>
      </h6>
      <h6>
        <br />
      </h6>
      <h6>Recent Collections</h6>
      <h6>
        Donor:
        {' '}
        {collectionsList[0].donor}
        {' | '}
        Date:
        {' '}
        {collectionsList[0].date}
        {' | '}
        Description:
        {' '}
        {collectionsList[0].description}
        {' | '}
        Dollar Value:
        {' $'}
        {collectionsList[0].value}
        {' | '}
        <button type="submit" onClick={handleChooseDonation}>Message</button>
        <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
      </h6>
      <h6>
        Donor:
        {' '}
        {collectionsList[1].donor}
        {' | '}
        Date:
        {' '}
        {collectionsList[1].date}
        {' | '}
        Description:
        {' '}
        {collectionsList[1].description}
        {' | '}
        Dollar Value:
        {' $'}
        {collectionsList[1].value}
        {' | '}
        <button type="submit" onClick={handleChooseDonation}>Message</button>
        <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
      </h6>
      <h6>
        Donor:
        {' '}
        {collectionsList[2].donor}
        {' | '}
        Date:
        {' '}
        {collectionsList[2].date}
        {' | '}
        Description:
        {' '}
        {collectionsList[2].description}
        {' | '}
        Dollar Value:
        {' $'}
        {collectionsList[2].value}
        {' | '}
        <button type="submit" onClick={handleChooseDonation}>Message</button>
        <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
      </h6>
      <h6>
        Donor:
        {' '}
        {collectionsList[3].donor}
        {' | '}
        Date:
        {' '}
        {collectionsList[3].date}
        {' | '}
        Description:
        {' '}
        {collectionsList[3].description}
        {' | '}
        Dollar Value:
        {' $'}
        {collectionsList[3].value}
        {' | '}
        <button type="submit" onClick={handleChooseDonation}>Message</button>
        <button type="submit" onClick={handleDeleteCollection}>Delete Collection</button>
        <br />
      </h6>
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart data={pdata2} margin={{ right: 50 }}>
          <CartesianGrid />
          <XAxis
            dataKey="date"
            interval="preserveStartEnd"
          />
          <YAxis />
          <Legend />
          <Tooltip />
          <Line
            dataKey="value"
            stroke="red"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <h6>
        Total Collections Received:
        {totalCollectionsReceived.current}
        {' | '}
        Total Collections Dollar Value:
        $
        {totalCollectionsValue.current}
      </h6>
      <h6>
        <button type="submit" onClick={handleReturnHome}>Return Home</button>
      </h6>
    </div>
  );
}

DonationsComponent.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default DonationsComponent;
