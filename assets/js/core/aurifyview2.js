// import { readSpreadValues } from '../core/spotrateDB.js';
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { app } from '../../../config/db.js';

const firestore = getFirestore(app)

setInterval(fetchData1, 500);

// setInterval(() => {
//     blinker()
// }, 500)

fetchData()
showTable(); 


let askSpread, bidSpread, goldValue, silverBidSpread, silverAskSpread, goldBuy, goldSell, silverBuy, silverSell, silverValue, goldValueUSD;

// Gold API KEY
const API_KEY = 'goldapi-fbqpmirloto20zi-io'

async function fetchData() {
    console.log('koiiii');
    let token = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIyMTlmN2Y0ZTQ2MjgzNmVhN2IyMGRlMjI5MWZhYWFiOSIsInBlcm1pc3Npb25zIjpbXSwiYWNjZXNzUnVsZXMiOlt7ImlkIjoidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpIiwibWV0aG9kcyI6WyJ0cmFkaW5nLWFjY291bnQtbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6OGFhOTRlYWQtMGVlMy00NGIyLTk2YjEtMzIxODBmNWE5YzVjIl19LHsiaWQiOiJtZXRhYXBpLXJlc3QtYXBpIiwibWV0aG9kcyI6WyJtZXRhYXBpLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo4YWE5NGVhZC0wZWUzLTQ0YjItOTZiMS0zMjE4MGY1YTljNWMiXX0seyJpZCI6Im1ldGFhcGktcnBjLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjhhYTk0ZWFkLTBlZTMtNDRiMi05NmIxLTMyMTgwZjVhOWM1YyJdfSx7ImlkIjoibWV0YWFwaS1yZWFsLXRpbWUtc3RyZWFtaW5nLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOjhhYTk0ZWFkLTBlZTMtNDRiMi05NmIxLTMyMTgwZjVhOWM1YyJdfSx7ImlkIjoibWV0YXN0YXRzLWFwaSIsIm1ldGhvZHMiOlsibWV0YXN0YXRzLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo4YWE5NGVhZC0wZWUzLTQ0YjItOTZiMS0zMjE4MGY1YTljNWMiXX0seyJpZCI6InJpc2stbWFuYWdlbWVudC1hcGkiLCJtZXRob2RzIjpbInJpc2stbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6OGFhOTRlYWQtMGVlMy00NGIyLTk2YjEtMzIxODBmNWE5YzVjIl19LHsiaWQiOiJtZXRhYXBpLXJlYWwtdGltZS1zdHJlYW1pbmctYXBpIiwibWV0aG9kcyI6WyJtZXRhYXBpLWFwaTp3czpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6OGFhOTRlYWQtMGVlMy00NGIyLTk2YjEtMzIxODBmNWE5YzVjIl19LHsiaWQiOiJjb3B5ZmFjdG9yeS1hcGkiLCJtZXRob2RzIjpbImNvcHlmYWN0b3J5LWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDo4YWE5NGVhZC0wZWUzLTQ0YjItOTZiMS0zMjE4MGY1YTljNWMiXX1dLCJ0b2tlbklkIjoiMjAyMTAyMTMiLCJpbXBlcnNvbmF0ZWQiOmZhbHNlLCJyZWFsVXNlcklkIjoiMjE5ZjdmNGU0NjI4MzZlYTdiMjBkZTIyOTFmYWFhYjkiLCJpYXQiOjE3MDkyMTg4NTEsImV4cCI6MTcxMTgxMDg1MX0.Q2IK0ReqNRDYcfYpaZF4_Neke8Kl3hYkPo7qBqNfeA7Dwq875Qw7p2Ja29F3ezl4MiinB8xt9egL4H3E79lmmWO0YipW0KcPaesBIwQ4mumK8aeJ2_zPupAGy3aq0gWaHLeRF4-hR0Lly6jTb_2WSNugXOGMsNMqZSl0LA0OD1IQ20mNv8wUpx3Vmgc4_TBnfB1dHCrtl2pcc-CJiazGuseaF3_slAAmneDwSfuSbgtqyO_Bt2HVORX85Ec1jZfp_zgjHaTSf_e4zSPreej1dce8Dm_dFd1358V1EcougVpPbbkV3WZGW4N3E9D4bENlIj0d5Jo7Df_mPGJzax2kS0eoktoFueuo267vElLioMNIYupcIBlHoUZbe3hszTF33xaIR1m-LyFsi_hMn7NBdjk1i456ZMc7Wh0-wEPDdQH04fpYTlTiUWWibOLCxbGIk8Oi7-jPDLOtwSHCC3srqO1qSWP_ErMsZip3A15nemMr0Vp_TuGwG4kZeXiFoMLg2kC4wtGZDNDv3yuOsw9nKPogCpDYnZ1deiHky7Ws1_rc3UbzjaniX31LMaOUGf-jYW9DcV_4WZsOVtpcCeVswBVhNS1_pNQWGWN9Ya2hMYj9XHcOzABJOZk0tu1h4C3O6gASesWoOpwpqsp-u-FKHRclFFDTVpgYUJ7rn81Zfnc';
    let accountId = '8aa94ead-0ee3-44b2-96b1-32180f5a9c5c';
    const api = new MetaApi.default(token);

    async function getRealTimeBidAskPrices() {
        try {
            const account = await api.metatraderAccountApi.getAccount(accountId);
            const initialState = account.state;
            const deployedStates = ['DEPLOYING', 'DEPLOYED'];

            if (!deployedStates.includes(initialState)) {
                // wait until account is deployed and connected to broker
                // console.log('Deploying account');
                await account.deploy();
            }
            // console.log('Waiting for API server to connect to broker (may take a couple of minutes)');
            await account.waitConnected();

            // connect to MetaApi API
            let connection = account.getStreamingConnection();
            await connection.connect();

            // wait until terminal state synchronized to the local state
            // console.log('Waiting for SDK to synchronize to terminal state (may take some time depending on your history size)');
            await connection.waitSynchronized();


            // Subscribe to real-time market data for XAUUSD.fix (gold) and XAGUSD.fix (silver)
            await connection.subscribeToMarketData('XAUUSD.fix', [{ type: 'quotes' }]);
            // await connection.subscribeToMarketData('XAGUSD.fix', [{ type: 'quotes' }]);

            // Access terminal state
            let terminalState = connection.terminalState;

            // let silverPrice = null;

            connection.addSynchronizationListener({
                async onSymbolPriceUpdated(instanceIndex, price) {
                    if (price.symbol === 'XAUUSD.fix' || price.symbol === 'XAGUSD.fix') {
                        console.log(`Real-time Bid and Ask Prices for ${price.symbol}:`, price);

                        const bidPrice = price.bid;
                        console.log('Bid Price:', bidPrice);

                        if (price.symbol === 'XAUUSD.fix') {
                            // Update gold price
                            setGoldValue(bidPrice)
                            // ... (other gold-related logic)
                        } else if (price.symbol === 'XAGUSD.fix') {
                            // Update silver price
                            // silverPrice = bidPrice;
                            // ... (other silver-related logic)
                        }

                        // Check if both gold and silver prices are available
                        if (goldPrice !== null && silverPrice !== null) {
                            // Perform actions that require both gold and silver data
                            console.log('Both gold and silver prices are available:', goldPrice, silverPrice);
                        }
                    }
                },
            });

            // Keep the script running to receive real-time updates
            // console.log('Listening for real-time updates. Press Ctrl+C to exit.');
            await new Promise(() => { });

            // Close the connection if the account was undeployed
            if (!deployedStates.includes(initialState)) {
                // console.log('Undeploying account');
                await connection.close();
                await account.undeploy();
            }
        } catch (err) {
            console.error(err);
        }
    }

    getRealTimeBidAskPrices();
}


// Function to Fetch Gold API Data
async function fetchData1() {
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", API_KEY);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const responseGold = await fetch("https://www.goldapi.io/api/XAU/USD", requestOptions);
        const responseSilver = await fetch("https://www.goldapi.io/api/XAG/USD", requestOptions);

        if (!responseGold.ok && !responseSilver.ok) {
            throw new Error('One or more network responses were not OK');
        }

        const resultGold = await responseGold.json();
        const resultSilver = await responseSilver.json();

        // Adjust based on the actual API response structure
        // var goldValueUSD = parseFloat(resultGold.price);
        var silverValueUSD = parseFloat(resultSilver.price)

        document.getElementById('goldRate').textContent = '$' + goldValueUSD.toFixed(2);
        document.getElementById('silverRate').textContent = '$' + silverValueUSD.toFixed(3)

        var GoldUSDResult = (goldValueUSD / 31.1035).toFixed(4);
        goldValue = (GoldUSDResult * 3.67).toFixed(4);

        var silverUSDResult = (silverValueUSD / 31.1035).toFixed(4)
        silverValue = parseFloat(silverUSDResult * 3.67).toFixed(4)

        var goldLowValue = parseFloat(resultGold.low_price);
        var goldHighValue = parseFloat(resultGold.high_price);
        var silverLowValue = parseFloat(resultSilver.low_price);
        var silverHighValue = parseFloat(resultSilver.high_price);


        goldBuy = (goldValueUSD + bidSpread).toFixed(2);
        goldSell = (goldValueUSD + askSpread + parseFloat(0.5)).toFixed(2);
        silverBuy = (silverValueUSD + silverBidSpread).toFixed(3);
        silverSell = (silverValueUSD + silverAskSpread + parseFloat(0.05)).toFixed(3);


        var currentGoldBuy = goldBuy;
        var currentGoldSell = goldSell;
        var currentSilverBuy = silverBuy;
        var currentSilverSell = silverSell;

        function updatePrice() {
            var newGoldBuy = goldBuy;
            var newGoldSell = goldSell;
            var newSilverBuy = silverBuy;
            var newSilverSell = silverSell;

            var element1 = document.getElementById("goldInputLow");
            var element2 = document.getElementById("goldInputHigh");
            var element3 = document.getElementById("silverInputLow");
            var element4 = document.getElementById("silverInputHigh");

            element1.innerHTML = newGoldBuy;
            element2.innerHTML = newGoldSell;
            element3.innerHTML = newSilverBuy;
            element4.innerHTML = newSilverSell;

            // Determine color for each element
            var color1;
            var fontColor1;
            if (newGoldBuy > currentGoldBuy) {
                color1 = "green";
                fontColor1 = "white"
            } else if (newGoldBuy < currentGoldBuy) {
                color1 = "red";
                fontColor1 = "white"
            } else {
                color1 = "white"; // Set to white if no change
                fontColor1 = "black"
            }

            var color2;
            var fontColor2;
            if (newGoldSell > currentGoldSell) {
                color2 = "green";
                fontColor2 = "white"
            } else if (newGoldSell < currentGoldSell) {
                color2 = "red";
                fontColor2 = "white"
            } else {
                color2 = "white"; // Set to white if no change
                fontColor2 = "black"
            }

            var color3;
            var fontColor3;
            if (newSilverBuy > currentSilverBuy) {
                color3 = "green";
                fontColor3 = "white"
            } else if (newSilverBuy < currentSilverBuy) {
                color3 = "red";
                fontColor3 = "white"
            } else {
                color3 = "white"; // Set to white if no change
                fontColor3 = "black"
            }

            var color4;
            var fontColor4;
            if (newSilverSell > currentSilverSell) {
                color4 = "green";
                fontColor4 = "white"
            } else if (newSilverSell < currentSilverSell) {
                color4 = "red";
                fontColor4 = "white"
            } else {
                color4 = "white"; // Set to white if no change
                fontColor4 = "black"
            }

            element1.style.backgroundColor = color1;
            element2.style.backgroundColor = color2;
            element3.style.backgroundColor = color3;
            element4.style.backgroundColor = color4;

            element1.style.color = fontColor1;
            element2.style.color = fontColor2;
            element3.style.color = fontColor3;
            element4.style.color = fontColor4;


            currentGoldBuy = newGoldBuy;
            currentGoldSell = newGoldSell;
            currentSilverBuy = newSilverBuy;
            currentSilverSell = newSilverSell;

            setTimeout(updatePrice, 300);
        }


        updatePrice();


        // document.getElementById("goldInputLow").innerHTML = goldBuy;
        // document.getElementById("goldInputHigh").innerHTML = goldSell;
        // document.getElementById("silverInputLow").innerHTML = silverBuy;
        // document.getElementById("silverInputHigh").innerHTML = silverSell;

        document.getElementById("lowLabelGold").innerHTML = goldLowValue;
        document.getElementById("highLabelGold").innerHTML = goldHighValue;
        document.getElementById("lowLabelSilver").innerHTML = silverLowValue;
        document.getElementById("highLabelSilver").innerHTML = silverHighValue;

        var element;

        // LowLabelGold
        element = document.getElementById("lowLabelGold");
        element.style.backgroundColor = "red";

        // HighLabelGold
        element = document.getElementById("highLabelGold");
        element.style.backgroundColor = "green";

        // LowLabelSilver
        element = document.getElementById("lowLabelSilver");
        element.style.backgroundColor = "red";

        // HighLabelSilver
        element = document.getElementById("highLabelSilver");
        element.style.backgroundColor = "green";
    } catch (error) {
        console.error('Error fetching gold and silver values:', error);
    }
}


function setGoldValue(value){
    goldValueUSD = value;
}


// function blinker() {
//     if (document.getElementById("goldInputLow")) {
//         var d = document.getElementById("goldInputLow");
//         d.classList.add("fading-label"); // Add the fading-label class
//         d.style.backgroundColor = (d.style.backgroundColor == 'white' ? 'transparent' : 'white');
//     }

//     if (document.getElementById("goldInputHigh")) {
//         var d = document.getElementById("goldInputHigh");
//         d.classList.add("fading-label"); // Add the fading-label class
//         d.style.backgroundColor = (d.style.backgroundColor == 'white' ? 'transparent' : 'white');
//     }

//     if (document.getElementById("silverInputLow")) {
//         var d = document.getElementById("silverInputLow");
//         d.classList.add("fading-label"); // Add the fading-label class
//         d.style.backgroundColor = (d.style.backgroundColor == 'white' ? '' : 'white');
//     }

//     if (document.getElementById("silverInputHigh")) {
//         var d = document.getElementById("silverInputHigh");
//         d.classList.add("fading-label"); // Add the fading-label class
//         d.style.backgroundColor = (d.style.backgroundColor == 'white' ? '' : 'white');
//     }
// }



async function readSpreadValues() {
    try {
        const uid = 'LnpQA4ZFsEPRbLul1zDTFj5tWvn1';
        if (!uid) {
            console.error('User not authenticated');
            throw new Error('User not authenticated');
        }

        const spreadCollection = collection(firestore, `users/${uid}/spread`);
        const querySnapshot = await getDocs(spreadCollection);

        const spreadDataArray = [];
        querySnapshot.forEach((doc) => {
            const spreadData = doc.data();
            const spreadDocId = doc.id;
            spreadDataArray.push({ id: spreadDocId, data: spreadData });
        });

        console.log(spreadDataArray);

        return spreadDataArray;
    } catch (error) {
        console.error('Error reading data from Firestore: ', error);
        throw error;
    }
}

async function displaySpreadValues() {
    try {
        const spreadDataArray = await readSpreadValues();

        spreadDataArray.forEach((spreadData) => {
            askSpread = spreadData.data.editedAskSpreadValue || 0;
            bidSpread = spreadData.data.editedBidSpreadValue || 0;
            silverAskSpread = spreadData.data.editedAskSilverSpreadValue || 0;
            silverBidSpread = spreadData.data.editedBidSilverSpreadValue || 0;
        });
    } catch (error) {
        console.error('Error reading spread values: ', error);
        throw error;
    }
}


// Function to read data from the Firestore collection
async function readData() {
    // Get the UID of the authenticated user
    const uid = 'LnpQA4ZFsEPRbLul1zDTFj5tWvn1';

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    const querySnapshot = await getDocs(collection(firestore, `users/${uid}/commodities`));
    const result = [];
    querySnapshot.forEach((doc) => {
        result.push({
            id: doc.id,
            data: doc.data()
        });
    });
    return result;
}

// Show Table from Database
async function showTable() {
    try {
        const tableData = await readData();
        // console.log('Data read successfully:', tableData);

        const tableBody = document.getElementById('tableBodyTV');
        console.log(tableData);

        setInterval(() => {
            var silver = silverValue

            // Silver 1GM Table Value
            // document.getElementById('silverBidTd').textContent = parseFloat((parseFloat(silver) + parseFloat(silverBidSpread) || 0) * 1000).toFixed(3);
            // document.getElementById('silverAskTd').textContent = parseFloat((parseFloat(silver) + 0.5 + parseFloat(silverAskSpread) || 0) * 1000).toFixed(3);
            //console.log(parseFloat(silver));
        }, 1000);

        // Loop through the tableData
        for (const data of tableData) {
            // Assign values from data to variables
            const metalInput = data.data.metal;
            const purityInput = data.data.purity;
            const unitInput = data.data.unit;
            const weightInput = data.data.weight;
            const sellAEDInput = data.data.sellAED;
            const buyAEDInput = data.data.buyAED;
            const sellPremiumInputAED = data.data.sellPremiumAED;
            const buyPremiumInputAED = data.data.buyPremiumAED;


            // Create a new table row
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
            <td style="text-align: right;" id="metalInput">Gold</td>
            <td style="text-align: left; font-size:28px; font-weight: 600;">${purityInput}</td>
            <td>${unitInput} ${weightInput}</td>
            <td id="buyAED">0</td>
            <td id="sellAED">0</td>
            
            `;

            // Append the new row to the table body
            tableBody.appendChild(newRow);

            displaySpreadValues();

            setInterval(async () => {
                let weight = weightInput;
                let unitMultiplier = 1;

                // Adjust unit multiplier based on the selected unit
                if (weight === "GM") {
                    unitMultiplier = 1;
                } else if (weight === "KG") {
                    unitMultiplier = 1000;
                } else if (weight === "TTB") {
                    unitMultiplier = 116.6400;
                } else if (weight === "TOLA") {
                    unitMultiplier = 11.664;
                } else if (weight === "OZ") {
                    unitMultiplier = 31.1034768;
                }


                let sellPremium = sellPremiumInputAED || 0;
                let buyPremium = buyPremiumInputAED || 0;
                let askSpreadValue = askSpread || 0;
                let bidSpreadValue = bidSpread || 0;


                if (weight === "GM") {
                    // Update the sellAED and buyAED values for the current 
                    newRow.querySelector("#sellAED").innerText = parseFloat(((parseFloat(goldValue) + parseFloat(askSpreadValue) + parseFloat(0.5)) * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + parseFloat(sellPremium)).toFixed(2));
                    newRow.querySelector("#buyAED").innerText = ((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + parseFloat(buyPremium)).toFixed(2);
                } else {
                    // Update the sellAED and buyAED values for the current row
                    const sellAEDValue = parseFloat(((parseFloat(goldValue) + parseFloat(askSpreadValue) + parseFloat(0.5)) * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + parseFloat(sellPremium)).toFixed(4));
                    const buyAEDValue = parseInt((parseFloat(goldValue) + parseFloat(bidSpreadValue)) * unitInput * unitMultiplier * (purityInput / Math.pow(10, purityInput.length)) + parseFloat(buyPremium)).toFixed(0);

                    newRow.querySelector("#sellAED").innerText = parseInt(sellAEDValue).toFixed(0); // Round to remove decimals
                    newRow.querySelector("#buyAED").innerText = parseInt(buyAEDValue).toFixed(0);   // Round to remove decimals
                }
            }, 500)
        }
    } catch (error) {
        console.error('Error reading data:', error);
    }
}
