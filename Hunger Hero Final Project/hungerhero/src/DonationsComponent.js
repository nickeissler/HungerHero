import React, {
  useState, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';
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
  const [graphData, setGraphData] = useState({});
  const [recentDons, setRecentDons] = useState({});
  const totalDonationsValue = useRef(0);
  const totalCollectionsValue = useRef(0);
  const [vNC, setvNC] = useState(true);

  // for mocking purposes
  // const deletionMade = useRef(false);
  // const [, setDeletionMade] = useState(false);
  const additionMade = useRef(false);
  const [, setAdditionMade] = useState(false);
  // end mocking

  function compareDate(a, b) {
    const arrA = a.date.split('/');
    const arrB = b.date.split('/');
    if (arrA[2] < arrB[2]) {
      return -1;
    } if (arrA[2] > arrB[2]) {
      return 1;
    } if (arrA[0] < arrB[0]) {
      return -1;
    } if (arrA[0] > arrB[0]) {
      return 1;
    } if (arrA[1] < arrB[1]) {
      return -1;
    } if (arrA[1] > arrB[1]) {
      return 1;
    }
    return 0;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result1 = [];
        const result2 = [];
        const dList = await apiModule.getDonations();

        let cnt = 0;
        if (user.type === 'collector') {
          for (let i = 0; i < dList.length; i += 1) {
            if (dList[i].collector === user.username) {
              result1[cnt] = { date: dList[i].date, value: dList[i].value };
              result2[cnt] = {
                donor: dList[i].donor,
                collector: dList[i].collector,
                date: dList[i].date,
                description: dList[i].description,
                value: dList[i].value,
              };
              cnt += 1;
            }
          }
        } else {
          for (let i = 0; i < dList.length; i += 1) {
            if (dList[i].donor === user.username) {
              result1[cnt] = { date: dList[i].date, value: dList[i].value };
              result2[cnt] = {
                donor: dList[i].donor,
                collector: dList[i].collector,
                date: dList[i].date,
                description: dList[i].description,
                value: dList[i].value,
              };
              cnt += 1;
            }
          }
        }

        const result1Sorted = result1.sort((a, b) => compareDate(a, b));
        const result2Sorted = result2.sort((a, b) => compareDate(a, b));
        const result2Final = result2Sorted.reverse();

        setGraphData(result1Sorted);
        setRecentDons(result2Final);
      } catch (err) {
        throw new Error('failed to load the graph data');
      }
    };
    fetchData();
  }, [newDonation.current]);

  function handleNewCollection() {
    newDonation.current = true;
    setNewDonation(true);
  }

  /*
  function handleDeleteCollection() {
    deletionMade.current = true;
    setDeletionMade(true);
  }

  function handleChooseDonation(e) {
    e.preventDefault();
  } */

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
    setvNC(true);
    if (newColDonor.current && newColDate && newColDescription && newColValue) {
      try {
        await apiModule.addDonation(
          newColDonor.current,
          user.username,
          newColDate.current,
          newColDescription.current,
          newColValue.current,
        );
      } catch (err) {
        throw new Error('could not add new donation');
      }
      newDonation.current = false;
      setNewDonation(false);
      additionMade.current = true;
      setAdditionMade(true);
    } else {
      console.log('invalid inputs');
      setvNC(false);
    }
  }

  if (newDonation.current) {
    console.log('rerender');
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
        <div>
          {' '}
          {!vNC
                && (
                <h6>
                  Please enter all fields, ensure date is &quot /&quot separated,
                  and value is an integer
                </h6>
                )}
        </div>
      </div>
    );
  }
  if (user.type === 'donor') {
    const rc = [];
    for (let i = 0; i < 5; i += 1) {
      if (recentDons[i] !== null) {
        rc[i] = recentDons[i];
      } else {
        rc[i] = {
          donor: 'N/A', collector: 'N/A', date: 'N/A', description: 'N/A', value: 'N/A',
        };
      }
    }
    /*
    let rc0 = {
      donor: 'N/A', collector: 'N/A', date: 'N/A', description: 'N/A', value: 'N/A',
    };
    let rc1 = {
      donor: 'N/A', collector: 'N/A', date: 'N/A', description: 'N/A', value: 'N/A',
    };
    let rc2 = {
      donor: 'N/A', collector: 'N/A', date: 'N/A', description: 'N/A', value: 'N/A',
    };
    let rc3 = {
      donor: 'N/A', collector: 'N/A', date: 'N/A', description: 'N/A', value: 'N/A',
    };
    let rc4 = {
      donor: 'N/A', collector: 'N/A', date: 'N/A', description: 'N/A', value: 'N/A',
    };

    if (recentDons[0]) {
      rc0 = recentDons[0];
    }
    if (recentDons[1]) {
      rc1 = recentDons[1];
    }
    if (recentDons[2]) {
      rc2 = recentDons[2];
    }
    if (recentDons[3]) {
      rc3 = recentDons[3];
    }
    if (recentDons[4]) {
      rc4 = recentDons[4];
    }
    */

    totalDonationsValue.current = 0;
    for (let i = 0; i < recentDons.length; i += 1) {
      totalDonationsValue.current += parseInt(recentDons[i].value, 10);
      console.log('recentDons[i].value');
      console.log(recentDons[i].value);
    }

    const itemArr = [];
    for (let i = 0; i < 5; i += 1) {
      itemArr[i] = (
        <h6>
          Donor:
          {' '}
          {rc[i].donor}
          {' | '}
          Collector:
          {' '}
          {rc[i].collector}
          {' | '}
          Date:
          {' '}
          {rc[i].date}
          {' | '}
          Description:
          {' '}
          {rc[i].description}
          {' | '}
          Dollar Value:
          {' $'}
          {rc[i].value}
          {' | '}
        </h6>
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
          {' '}
        </h6>
        <h6>
          {' '}
        </h6>
        <h6>
          <br />
        </h6>
        <h6>Recent Donations</h6>
        { itemArr }
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart data={graphData} margin={{ right: 50 }}>
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
          {recentDons.length}
          {' | '}
          Total Donations Dollar Value:
          $
          {totalDonationsValue.current}
        </h6>
      </div>
    );
  }
  console.log('recentDons');
  console.log(recentDons);
  const rca = [];
  for (let i = 0; i < 5; i += 1) {
    if (recentDons[i] === null) {
      rca[i] = {
        donor: 'N/A', collector: 'N/A', date: 'N/A', description: 'N/A', value: 'N/A',
      };
    } else {
      rca[i] = recentDons[i];
    }
  }

  const itemArra = [];
  for (let i = 0; i < 5; i += 1) {
    itemArra[i] = (
      <h6>
        Donor:
        {' '}
        {rca[i].donor}
        {' | '}
        Collector:
        {' '}
        {rca[i].collector}
        {' | '}
        Date:
        {' '}
        {rca[i].date}
        {' | '}
        Description:
        {' '}
        {rca[i].description}
        {' | '}
        Dollar Value:
        {' $'}
        {rca[i].value}
        {' | '}
      </h6>
    );
  }

  totalCollectionsValue.current = 0;
  for (let i = 0; i < recentDons.length; i += 1) {
    totalCollectionsValue.current += parseInt(recentDons[i].value, 10);
    console.log('recentDons[i].value');
    console.log(recentDons[i].value);
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
      <h6>Most Recent Collections</h6>
      { itemArra }
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart data={graphData} margin={{ right: 50 }}>
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
        {recentDons.length}
        {' | '}
        Total Collections Dollar Value:
        $
        {totalCollectionsValue.current}
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
