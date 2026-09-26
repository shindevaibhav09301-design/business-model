import { NormalizedCity } from '@/types';

export interface DistrictInfo extends NormalizedCity {
  district: string;
  region: 'Marathwada' | 'Vidarbha' | 'Konkan' | 'Paschim Maharashtra' | 'Khandesh' | string;
  pincode: string;
  popularAreas: string[];
  headquarters?: string;
  division?: string;
}

// Master Registry of all 36 Districts of Maharashtra across 5 Administrative Regions
export const MAHARASHTRA_DISTRICTS: DistrictInfo[] = [
  // =========================================================================
  // 1. MARATHWADA REGION (Chhatrapati Sambhajinagar Division) - 8 Districts
  // =========================================================================
  {
    city: 'Hingoli',
    district: 'Hingoli',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Marathwada',
    division: 'Chhatrapati Sambhajinagar Division',
    latitude: 19.7180,
    longitude: 77.1490,
    pincode: '431513',
    aliases: ['hingoli city', 'hingoli district', 'kalamnuri', 'basmath', 'aundha nagnath', 'sengaon'],
    formatted: 'Hingoli, Maharashtra, India',
    popularAreas: ['Hingoli City', 'Kalamnuri', 'Basmath', 'Aundha Nagnath', 'Sengaon', 'Station Road', 'Sant Namdev Nagar', 'MIDC Hingoli']
  },
  {
    city: 'Parbhani',
    district: 'Parbhani',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Marathwada',
    division: 'Chhatrapati Sambhajinagar Division',
    latitude: 19.2608,
    longitude: 76.7749,
    pincode: '431401',
    aliases: ['prabhavati', 'parbhani city', 'parbhani district', 'gangakhed', 'jintur', 'sailu'],
    formatted: 'Parbhani, Maharashtra, India',
    popularAreas: ['Station Road', 'Gangakhed Road', 'Jintur Road', 'Sailu', 'Manwath', 'Pathri', 'Purna', 'Sonpeth', 'MIDC Parbhani']
  },
  {
    city: 'Chhatrapati Sambhajinagar',
    district: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Marathwada',
    division: 'Chhatrapati Sambhajinagar Division',
    latitude: 19.8762,
    longitude: 75.3433,
    pincode: '431001',
    aliases: ['aurangabad', 'sambhajinagar', 'aurangabad city', 'aurangabad district', 'chhatrapati sambhaji nagar'],
    formatted: 'Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, India',
    popularAreas: ['CIDCO', 'Waluj MIDC', 'Chikalthana', 'Shendra DMIC', 'Paithan', 'Vaijapur', 'Kannad', 'Gangapur', 'Khuldabad']
  },
  {
    city: 'Nanded',
    district: 'Nanded',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Marathwada',
    division: 'Chhatrapati Sambhajinagar Division',
    latitude: 19.1383,
    longitude: 77.3210,
    pincode: '431601',
    aliases: ['nanded waghala', 'nanded city', 'nanded district', 'hazur sahib', 'degloor'],
    formatted: 'Nanded, Maharashtra, India',
    popularAreas: ['Nanded City', 'Degloor', 'Mukhed', 'Kinwat', 'Mudkhed', 'Hadgaon', 'Loha', 'Bhokar', 'MIDC Krushnoor']
  },
  {
    city: 'Latur',
    district: 'Latur',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Marathwada',
    division: 'Chhatrapati Sambhajinagar Division',
    latitude: 18.4088,
    longitude: 76.5604,
    pincode: '413512',
    aliases: ['latur city', 'latur district', 'udgir', 'ahmedpur', 'ausa'],
    formatted: 'Latur, Maharashtra, India',
    popularAreas: ['Latur City', 'Udgir', 'Ahmedpur', 'Ausa', 'Nilanga', 'Renapur', 'Chakur', 'Shirur Anantpal', 'MIDC Latur']
  },
  {
    city: 'Jalna',
    district: 'Jalna',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Marathwada',
    division: 'Chhatrapati Sambhajinagar Division',
    latitude: 19.8347,
    longitude: 75.8816,
    pincode: '431203',
    aliases: ['jalna city', 'jalna district', 'steel city maharashtra', 'partur', 'ambad'],
    formatted: 'Jalna, Maharashtra, India',
    popularAreas: ['Jalna City', 'Partur', 'Ambad', 'Bhokardan', 'Badnapur', 'Jafrabad', 'Ghansawangi', 'Mantha', 'MIDC Jalna']
  },
  {
    city: 'Beed',
    district: 'Beed',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Marathwada',
    division: 'Chhatrapati Sambhajinagar Division',
    latitude: 18.9891,
    longitude: 75.7601,
    pincode: '431122',
    aliases: ['bid', 'beed city', 'beed district', 'parli vaijnath', 'majalgaon'],
    formatted: 'Beed, Maharashtra, India',
    popularAreas: ['Beed City', 'Parli Vaijnath', 'Majalgaon', 'Georai', 'Ashti', 'Kaij', 'Patoda', 'Dharur', 'Wadwani']
  },
  {
    city: 'Dharashiv',
    district: 'Dharashiv',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Marathwada',
    division: 'Chhatrapati Sambhajinagar Division',
    latitude: 18.1764,
    longitude: 76.0407,
    pincode: '413501',
    aliases: ['osmanabad', 'dharashiv city', 'osmanabad district', 'tuljapur', 'omerga'],
    formatted: 'Dharashiv (Osmanabad), Maharashtra, India',
    popularAreas: ['Dharashiv City', 'Tuljapur', 'Omerga', 'Paranda', 'Kalamb', 'Bhum', 'Washi', 'Lohara']
  },

  // =========================================================================
  // 2. VIDARBHA REGION (Nagpur & Amravati Divisions) - 11 Districts
  // =========================================================================
  {
    city: 'Nagpur',
    district: 'Nagpur',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Nagpur Division',
    latitude: 21.1458,
    longitude: 79.0882,
    pincode: '440001',
    aliases: ['orange city', 'nagpore', 'nagpur city', 'nagpur district', 'mihan'],
    formatted: 'Nagpur, Maharashtra, India',
    popularAreas: ['Sitabuldi', 'Dharampeth', 'Civil Lines', 'MIDC Hingna', 'Wardhaman Nagar', 'MIHAN SEZ', 'Kamptee', 'Katol', 'Ramtek']
  },
  {
    city: 'Amravati',
    district: 'Amravati',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Amravati Division',
    latitude: 20.9374,
    longitude: 77.7796,
    pincode: '444601',
    aliases: ['amraoti', 'amravati city', 'amravati district', 'achalpur', 'chikhaldara'],
    formatted: 'Amravati, Maharashtra, India',
    popularAreas: ['Amravati City', 'Achalpur', 'Warud', 'Morshi', 'Daryapur', 'Anjangaon', 'Chikhaldara', 'Chandur Bazar', 'Badnera']
  },
  {
    city: 'Akola',
    district: 'Akola',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Amravati Division',
    latitude: 20.7002,
    longitude: 77.0082,
    pincode: '444001',
    aliases: ['akola city', 'akola district', 'murtizapur', 'akot'],
    formatted: 'Akola, Maharashtra, India',
    popularAreas: ['Akola City', 'Murtizapur', 'Akot', 'Balapur', 'Telhara', 'Patur', 'Barshitakli', 'MIDC Phase IV']
  },
  {
    city: 'Buldhana',
    district: 'Buldhana',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Amravati Division',
    latitude: 20.5292,
    longitude: 76.1843,
    pincode: '443001',
    aliases: ['buldana', 'buldhana city', 'buldhana district', 'shegaon', 'khamgaon'],
    formatted: 'Buldhana, Maharashtra, India',
    popularAreas: ['Buldhana City', 'Khamgaon', 'Malkapur', 'Shegaon', 'Chikhli', 'Mehkar', 'Nandura', 'Deulgaon Raja', 'Lonar']
  },
  {
    city: 'Washim',
    district: 'Washim',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Amravati Division',
    latitude: 20.1118,
    longitude: 77.1352,
    pincode: '444505',
    aliases: ['washim city', 'washim district', 'karanja lad', 'risod'],
    formatted: 'Washim, Maharashtra, India',
    popularAreas: ['Washim City', 'Risod', 'Karanja Lad', 'Malegaon', 'Mangrulpir', 'Manora', 'Civil Lines Washim']
  },
  {
    city: 'Yavatmal',
    district: 'Yavatmal',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Amravati Division',
    latitude: 20.3888,
    longitude: 78.1204,
    pincode: '445001',
    aliases: ['yeotmal', 'yavatmal city', 'yavatmal district', 'pusad', 'wani'],
    formatted: 'Yavatmal, Maharashtra, India',
    popularAreas: ['Yavatmal City', 'Pusad', 'Umarkhed', 'Wani', 'Digras', 'Ghatanji', 'Darwha', 'Arni', 'Pandharkawada']
  },
  {
    city: 'Wardha',
    district: 'Wardha',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Nagpur Division',
    latitude: 20.7453,
    longitude: 78.6022,
    pincode: '442001',
    aliases: ['sevagram', 'wardha city', 'wardha district', 'hinganghat'],
    formatted: 'Wardha, Maharashtra, India',
    popularAreas: ['Wardha City', 'Hinganghat', 'Arvi', 'Sevagram', 'Deoli', 'Pulgaon', 'Seloo', 'Karanja Ghadge']
  },
  {
    city: 'Chandrapur',
    district: 'Chandrapur',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Nagpur Division',
    latitude: 19.9615,
    longitude: 79.2961,
    pincode: '442401',
    aliases: ['chanda', 'chandrapur city', 'chandrapur district', 'tadoba', 'ballarpur'],
    formatted: 'Chandrapur, Maharashtra, India',
    popularAreas: ['Chandrapur City', 'Ballarpur', 'Warora', 'Bhadravati', 'Rajura', 'Mul', 'Nagbhid', 'Sindewahi', 'Bramhapuri']
  },
  {
    city: 'Gadchiroli',
    district: 'Gadchiroli',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Nagpur Division',
    latitude: 20.1809,
    longitude: 80.0042,
    pincode: '442605',
    aliases: ['gadchiroli city', 'gadchiroli district', 'armori', 'aheri'],
    formatted: 'Gadchiroli, Maharashtra, India',
    popularAreas: ['Gadchiroli City', 'Armori', 'Desaiganj', 'Chamorshi', 'Aheri', 'Kurkheda', 'Dhanora', 'Sironcha']
  },
  {
    city: 'Bhandara',
    district: 'Bhandara',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Nagpur Division',
    latitude: 21.1714,
    longitude: 79.6548,
    pincode: '441904',
    aliases: ['bhandara city', 'bhandara district', 'brass city maharashtra', 'tumsar'],
    formatted: 'Bhandara, Maharashtra, India',
    popularAreas: ['Bhandara City', 'Tumsar', 'Sakoli', 'Mohadi', 'Pauni', 'Lakhani', 'Lakhandur']
  },
  {
    city: 'Gondia',
    district: 'Gondia',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Vidarbha',
    division: 'Nagpur Division',
    latitude: 21.4578,
    longitude: 80.1961,
    pincode: '441601',
    aliases: ['gondiya', 'gondia city', 'gondia district', 'rice city maharashtra', 'tirora'],
    formatted: 'Gondia, Maharashtra, India',
    popularAreas: ['Gondia City', 'Tirora', 'Amgaon', 'Goregaon', 'Salekasa', 'Sadak Arjuni', 'Deori', 'Arjuni Morgaon']
  },

  // =========================================================================
  // 3. PASCHIM MAHARASHTRA (Pune Division) - 5 Districts
  // =========================================================================
  {
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Paschim Maharashtra',
    division: 'Pune Division',
    latitude: 18.5204,
    longitude: 73.8567,
    pincode: '411001',
    aliases: ['poona', 'punawale', 'pcmc', 'pimpri-chinchwad', 'pune district', 'oxford of the east'],
    formatted: 'Pune, Maharashtra, India',
    popularAreas: ['Shivajinagar', 'Kothrud', 'Hinjawadi IT Park', 'Kalyani Nagar', 'Viman Nagar', 'Hadapsar Magarpatta', 'Baner', 'Wakad', 'Pimpri-Chinchwad', 'Baramati']
  },
  {
    city: 'Kolhapur',
    district: 'Kolhapur',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Paschim Maharashtra',
    division: 'Pune Division',
    latitude: 16.7050,
    longitude: 74.2433,
    pincode: '416001',
    aliases: ['kolhapuri', 'karveer', 'kolhapur city', 'kolhapur district', 'ichalkaranji'],
    formatted: 'Kolhapur, Maharashtra, India',
    popularAreas: ['Kolhapur City', 'Ichalkaranji', 'Jaysingpur', 'Kagal MIDC', 'Gadhinglaj', 'Panhala', 'Hatkanangle', 'Shirol', 'Radhanagari']
  },
  {
    city: 'Satara',
    district: 'Satara',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Paschim Maharashtra',
    division: 'Pune Division',
    latitude: 17.6805,
    longitude: 74.0183,
    pincode: '415001',
    aliases: ['satara city', 'satara district', 'karad', 'mahabaleshwar', 'wai', 'panchgani'],
    formatted: 'Satara, Maharashtra, India',
    popularAreas: ['Satara City', 'Karad', 'Wai', 'Phaltan', 'Mahabaleshwar', 'Panchgani', 'Patan', 'Koregaon', 'Khandala']
  },
  {
    city: 'Sangli',
    district: 'Sangli',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Paschim Maharashtra',
    division: 'Pune Division',
    latitude: 16.8524,
    longitude: 74.5815,
    pincode: '416416',
    aliases: ['sangli miraj kupwad', 'sangli city', 'sangli district', 'miraj', 'turmeric city maharashtra'],
    formatted: 'Sangli, Maharashtra, India',
    popularAreas: ['Sangli City', 'Miraj', 'Kupwad MIDC', 'Islampur', 'Tasgaon', 'Vita', 'Jat', 'Walwa', 'Shirala']
  },
  {
    city: 'Solapur',
    district: 'Solapur',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Paschim Maharashtra',
    division: 'Pune Division',
    latitude: 17.6599,
    longitude: 75.9064,
    pincode: '413001',
    aliases: ['sholapur', 'solapuri', 'solapur city', 'solapur district', 'pandharpur', 'barshi'],
    formatted: 'Solapur, Maharashtra, India',
    popularAreas: ['Solapur City', 'Pandharpur', 'Barshi', 'Akkalkot', 'Mohol', 'Sangola', 'Karmala', 'Madha', 'Mangalwedha']
  },

  // =========================================================================
  // 4. KHANDESH & NASHIK REGION (Nashik Division) - 5 Districts
  // =========================================================================
  {
    city: 'Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Khandesh',
    division: 'Nashik Division',
    latitude: 19.9975,
    longitude: 73.7898,
    pincode: '422001',
    aliases: ['nasik', 'panchavati', 'nashik road', 'nashik district', 'wine capital of india', 'malegaon'],
    formatted: 'Nashik, Maharashtra, India',
    popularAreas: ['Nashik Road', 'Panchavati', 'Satpur MIDC', 'Ambad MIDC', 'Gangapur Road', 'College Road', 'Malegaon', 'Sinnar', 'Trimbakeshwar', 'Ozar']
  },
  {
    city: 'Ahmednagar',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Khandesh',
    division: 'Nashik Division',
    latitude: 19.0948,
    longitude: 74.7480,
    pincode: '414001',
    aliases: ['ahilyanagar', 'ahmadnagar', 'nagar', 'ahmednagar city', 'ahmednagar district', 'shirdi', 'sangamner'],
    formatted: 'Ahmednagar (Ahilyanagar), Maharashtra, India',
    popularAreas: ['Ahmednagar City', 'Shirdi', 'Sangamner', 'Rahuri', 'Kopargaon', 'Shrirampur', 'Nevasa', 'Akole', 'Parner', 'Jamkhed']
  },
  {
    city: 'Jalgaon',
    district: 'Jalgaon',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Khandesh',
    division: 'Nashik Division',
    latitude: 21.0077,
    longitude: 75.5626,
    pincode: '425001',
    aliases: ['jalgaon city', 'jalgaon district', 'banana city', 'gold city', 'bhusawal'],
    formatted: 'Jalgaon, Maharashtra, India',
    popularAreas: ['Jalgaon City', 'Bhusawal', 'Chalisgaon', 'Amalner', 'Pachora', 'Raver', 'Yawal', 'Chopda', 'Jamner']
  },
  {
    city: 'Dhule',
    district: 'Dhule',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Khandesh',
    division: 'Nashik Division',
    latitude: 20.9042,
    longitude: 74.7749,
    pincode: '424001',
    aliases: ['dhulia', 'dhule city', 'dhule district', 'shirpur', 'dondaicha'],
    formatted: 'Dhule, Maharashtra, India',
    popularAreas: ['Dhule City', 'Shirpur', 'Dondaicha', 'Sakri', 'Sindkheda', 'MIDC Awadhan', 'Devpur']
  },
  {
    city: 'Nandurbar',
    district: 'Nandurbar',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Khandesh',
    division: 'Nashik Division',
    latitude: 21.3697,
    longitude: 74.2405,
    pincode: '425412',
    aliases: ['nandurbar city', 'nandurbar district', 'shahada', 'navapur', 'toranmal'],
    formatted: 'Nandurbar, Maharashtra, India',
    popularAreas: ['Nandurbar City', 'Shahada', 'Navapur', 'Taloda', 'Akkalkuwa', 'Dhadgaon', 'Toranmal Hill Station']
  },

  // =========================================================================
  // 5. KONKAN REGION (Konkan Division) - 7 Districts
  // =========================================================================
  {
    city: 'Mumbai City',
    district: 'Mumbai City',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Konkan',
    division: 'Konkan Division',
    latitude: 18.9388,
    longitude: 72.8354,
    pincode: '400001',
    aliases: ['mumbai', 'bombay', 'south mumbai', 'mumbai city district', 'nariman point'],
    formatted: 'Mumbai City, Maharashtra, India',
    popularAreas: ['Fort', 'Colaba', 'Nariman Point', 'Marine Lines', 'Dadar', 'Byculla', 'Worli', 'Lower Parel', 'Prabhadevi']
  },
  {
    city: 'Mumbai Suburban',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Konkan',
    division: 'Konkan Division',
    latitude: 19.1176,
    longitude: 72.8631,
    pincode: '400050',
    aliases: ['suburban mumbai', 'bandra', 'andheri', 'borivali', 'kurla', 'mumbai suburban district'],
    formatted: 'Mumbai Suburban, Maharashtra, India',
    popularAreas: ['Bandra BKC', 'Andheri East & West', 'Borivali', 'Goregaon', 'Malad', 'Kurla', 'Ghatkopar', 'Powai', 'Vile Parle', 'Kandivali']
  },
  {
    city: 'Thane',
    district: 'Thane',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Konkan',
    division: 'Konkan Division',
    latitude: 19.2183,
    longitude: 72.9781,
    pincode: '400601',
    aliases: ['thana', 'thane city', 'kalyan', 'dombivli', 'thane district', 'navi mumbai thane', 'ulhasnagar'],
    formatted: 'Thane, Maharashtra, India',
    popularAreas: ['Thane West', 'Ghodbunder Road', 'Kalyan', 'Dombivli', 'Ulhasnagar', 'Bhiwandi', 'Mira-Bhayandar', 'Ambernath', 'Badlapur']
  },
  {
    city: 'Palghar',
    district: 'Palghar',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Konkan',
    division: 'Konkan Division',
    latitude: 19.6967,
    longitude: 72.7699,
    pincode: '401404',
    aliases: ['tarapur', 'vasai-virar', 'palghar district', 'boisar', 'dahanu'],
    formatted: 'Palghar, Maharashtra, India',
    popularAreas: ['Palghar City', 'Vasai', 'Virar', 'Boisar MIDC', 'Tarapur MIDC', 'Dahanu', 'Jawhar', 'Wada', 'Mokhada', 'Talasari']
  },
  {
    city: 'Raigad',
    district: 'Raigad',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Konkan',
    division: 'Konkan Division',
    latitude: 18.5158,
    longitude: 73.1822,
    pincode: '402107',
    aliases: ['alibag', 'alibaug', 'panvel', 'raigad district', 'khopoli', 'karjat', 'mahad'],
    formatted: 'Raigad (Alibag / Panvel), Maharashtra, India',
    popularAreas: ['Panvel', 'Alibaug', 'Khopoli', 'Karjat', 'Mahad MIDC', 'Pen', 'Roha', 'Mangaon', 'Uran JNPT', 'Shrivardhan']
  },
  {
    city: 'Ratnagiri',
    district: 'Ratnagiri',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Konkan',
    division: 'Konkan Division',
    latitude: 16.9902,
    longitude: 73.3120,
    pincode: '415612',
    aliases: ['ratnagiri city', 'konkan ratnagiri', 'chiplun', 'ratnagiri district', 'dapoli', 'khed'],
    formatted: 'Ratnagiri, Maharashtra, India',
    popularAreas: ['Ratnagiri City', 'Chiplun', 'Khed', 'Guhagar', 'Dapoli', 'Rajapur', 'Sangameshwar', 'Lanja', 'Mandangad']
  },
  {
    city: 'Sindhudurg',
    district: 'Sindhudurg',
    state: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    region: 'Konkan',
    division: 'Konkan Division',
    latitude: 16.1265,
    longitude: 73.7126,
    pincode: '416812',
    aliases: ['oros', 'sawantwadi', 'malvan', 'sindhudurg district', 'kudal', 'kankavli', 'vengurla'],
    formatted: 'Sindhudurg (Oras), Maharashtra, India',
    popularAreas: ['Oras', 'Sawantwadi', 'Kudal', 'Malvan', 'Kankavli', 'Vengurla', 'Devgad', 'Vaibhavwadi', 'Dodamarg']
  }
];

// Fast Lookup Index Map by City/District name (lowercase) and Aliases
export const MAHARASHTRA_DISTRICTS_LOOKUP: Map<string, DistrictInfo> = new Map();

for (const d of MAHARASHTRA_DISTRICTS) {
  MAHARASHTRA_DISTRICTS_LOOKUP.set(d.city.toLowerCase(), d);
  MAHARASHTRA_DISTRICTS_LOOKUP.set(d.district.toLowerCase(), d);
  MAHARASHTRA_DISTRICTS_LOOKUP.set(d.city.toLowerCase().replace(/\\s+/g, ''), d);
  for (const alias of d.aliases) {
    MAHARASHTRA_DISTRICTS_LOOKUP.set(alias.toLowerCase(), d);
    MAHARASHTRA_DISTRICTS_LOOKUP.set(alias.toLowerCase().replace(/\\s+/g, ''), d);
  }
}

// Backward compatibility export
export const INDIA_DISTRICTS = MAHARASHTRA_DISTRICTS;
export const INDIA_DISTRICTS_LOOKUP = MAHARASHTRA_DISTRICTS_LOOKUP;

export function findMaharashtraDistrict(query: string): DistrictInfo | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  const qClean = q.replace(/\\s+/g, '');
  
  // 1. Direct key match
  if (MAHARASHTRA_DISTRICTS_LOOKUP.has(q)) {
    return MAHARASHTRA_DISTRICTS_LOOKUP.get(q);
  }
  if (MAHARASHTRA_DISTRICTS_LOOKUP.has(qClean)) {
    return MAHARASHTRA_DISTRICTS_LOOKUP.get(qClean);
  }

  // 2. Contains match
  for (const d of MAHARASHTRA_DISTRICTS) {
    const dLower = d.city.toLowerCase();
    if (q === dLower || q.includes(dLower) || dLower.includes(q)) {
      return d;
    }
    const distLower = d.district.toLowerCase();
    if (q === distLower || q.includes(distLower) || distLower.includes(q)) {
      return d;
    }
    if (d.aliases.some((a) => q.includes(a.toLowerCase()) || a.toLowerCase().includes(q))) {
      return d;
    }
    if (d.popularAreas.some((p) => q.includes(p.toLowerCase()) || p.toLowerCase().includes(q))) {
      return d;
    }
  }

  return undefined;
}

// Backward-compatible alias
export const findIndiaDistrict = findMaharashtraDistrict;
