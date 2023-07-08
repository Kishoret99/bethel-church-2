import { useEffect, useMemo, useState } from 'react';
import useGoogleSheets from 'use-google-sheets';
import debounce from 'lodash.debounce';
import './App.css';
import serviceJson from './bethel-church-2-709ecbaf32c2.js'

const jsonKeyMap = {
  name: "Name / పేరు",
  surname: "Surname / ఇంటిపేరు",
  phoneNumber: "Phone Number / ఫోను నంబరు",
  dob: "Date of Birth / పుట్టిన తేది",
  id: "🔐 Softr Record ID",
  timestamp: "Timestamp"
};

const Layout = ({children}) => {
  return  (
    <section className="bg-gray-50 dark:bg-gray-900 dark">
      <div className="mx-auto max-w-screen-xl lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              {children}
          </div>
      </div>
    </section>
  );
}

const Top = ({searchTerm, onSearchChange}) => (
  <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 fixed w-full">
    <div className="w-full md:w-1/2">
        <form className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input 
                  type="text" 
                  id="simple-search" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search"
                  required="" 
                  value={searchTerm}
                  onChange={onSearchChange}
                />
            </div>
        </form>
    </div>
    {/* <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
        <button type="button" className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
            <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            Add product
        </button>
        <div className="flex items-center space-x-3 w-full md:w-auto">
            <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown" className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                <svg className="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
                Actions
            </button>
            <div id="actionsDropdown" className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="actionsDropdownButton">
                    <li>
                        <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mass Edit</a>
                    </li>
                </ul>
                <div className="py-1">
                    <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete all</a>
                </div>
            </div>
            <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filter
                <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </button>
            <div id="filterDropdown" className="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Choose brand</h6>
                <ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                    <li className="flex items-center">
                        <input id="apple" type="checkbox" value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                        <label htmlFor="apple" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Apple (56)</label>
                    </li>
                    <li className="flex items-center">
                        <input id="fitbit" type="checkbox" value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                        <label htmlFor="fitbit" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Microsoft (16)</label>
                    </li>
                    <li className="flex items-center">
                        <input id="razor" type="checkbox" value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                        <label htmlFor="razor" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Razor (49)</label>
                    </li>
                    <li className="flex items-center">
                        <input id="nikon" type="checkbox" value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                        <label htmlFor="nikon" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Nikon (12)</label>
                    </li>
                    <li className="flex items-center">
                        <input id="benq" type="checkbox" value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                        <label htmlFor="benq" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">BenQ (74)</label>
                    </li>
                </ul>
            </div>
        </div>
    </div> */}
  </div>
)

function App() {
  const { data, loading, error } = useGoogleSheets({
    apiKey: serviceJson.apiKey,
    sheetId: serviceJson.sheetId,
  });

  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (e) => {
    console.log('event', e?.target?.value);
    setSearchTerm(e?.target?.value || '');
  };
  const dHandleChange = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);

  useEffect(() => {
    console.log('@@', searchTerm);
  }, [searchTerm])

  useEffect(() => {
    if(data && data[0] && data[0].data) {
      console.log(data[0].data);
      setMembers(data[0].data);
    }
  }, [data?.length])

  if (loading) {
    return (
      <span className="loader"></span>
    )
  }

  if (error) {
    return <div>Error!</div>;
  }

  // return <div>{JSON.stringify(data)}</div>;

//   {
//     "Timestamp": "6/18/2023 7:56:45",
//     "Name / పేరు": " Karthik ",
//     "Surname / ఇంటిపేరు": "Raipudi ",
//     "Father's or Husband name / తండ్రి లేదా భర్త పేరు": "Srinivas Rao ",
//     "Phone Number / ఫోను నంబరు": "7386289222",
//     "Gender / లింగం": "Male",
//     "Do you live in Narasaraopet or Ravipadu? / మీరు నరసరావుపేటలో  లేదా రావిపాడు ఉంటున్నారా?": "NO",
//     "Area / ప్రాంతం": "RAVIPADU / రావిపాడు",
//     "Landmark / సమీప సరిహద్దు గుర్తు": "YSR statue ",
//     "Complete Address / పూర్తి చిరునామా": "2-115 vr nagar, ravipadu ",
//     "Occupation or Studying / వృత్తి లేదా చదువు": "Photography ",
//     "Are you Baptised? / మీరు బాప్టిజం పొందారా?": "Yes",
//     "Photo / ఫోటో": "https://drive.google.com/open?id=14hY3A1MNUmCbAmq-5VRcXnc6YIxjidZp",
//     "Date of Birth / పుట్టిన తేది": "2/14/2023",
//     "Email Address": "chiranjeevigera7@gmail.com",
//     "How long have you been coming to church /  మీరు ఎంత కాలము నుండి చర్చికి వస్తున్నారు?": "More than 1Year / 1 సంవత్సరం కంటే ఎక్కువ",
//     "Are you Married? /  మీకు పెళ్లి అయ్యిందా?": "No",
//     "Are you interested in serving ? /   మీకు సేవ చేయడానికి ఆసక్తి ఉందా?": "Yes",
//     "Age / వయస్సు": "",
//     "🔐 Softr Record ID": "F4aTYoRwjJP6YrwsiDHwNh"
// }

  let membersToRender = members;

  const rowsToRender = [jsonKeyMap.name, jsonKeyMap.surname, jsonKeyMap.phoneNumber, jsonKeyMap.dob] 

  if(searchTerm != '') {
    membersToRender = members.filter(member => {
      const renderedValues = rowsToRender.map(row => member[row]);
      return renderedValues.find(renderedValue => renderedValue.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) > -1)
    })
  }

  return (
    <Layout>
      <Top searchTerm={searchTerm} onSearchChange={handleChange}/>
      <div className="overflow-x-auto p-4" style={{paddingTop: "60px"}}>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-4 py-3">Name</th>
                    <th scope="col" className="px-4 py-3">Phone Number</th>
                    <th scope="col" className="px-4 py-3">Date of Birth</th>
                    {/* <th scope="col" className="px-4 py-3">Brand</th>
                    <th scope="col" className="px-4 py-3">Description</th>
                    <th scope="col" className="px-4 py-3">Price</th>
                    <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Actions</span>
                    </th> */}
                </tr>
            </thead>
            <tbody>
                {membersToRender.map((member, i) => (
                  <tr className="border-b dark:border-gray-700" key={jsonKeyMap.id + "___idx___"+i}>
                    <td scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{member["Name / పేరు"] + " " + member["Surname / ఇంటిపేరు"]}</td>
                    <td className="px-4 py-3">{member["Phone Number / ఫోను నంబరు"]}</td>
                    <td className="px-4 py-3">{member["Date of Birth / పుట్టిన తేది"]}</td>
                  </tr>
                ))}
            </tbody>
        </table>
      </div>
      {/* <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span className="font-semibold text-gray-900 dark:text-white">1-10</span>
            of
            <span className="font-semibold text-gray-900 dark:text-white">1000</span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px">
            <li>
                <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Previous</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
            </li>
            <li>
                <a href="#" aria-current="page" className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Next</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </a>
            </li>
        </ul>
      </nav> */}
    </Layout>
  );
}

export default App;
