import re
import requests
import json

STOP_WORDS = ['laptop', 'display', 'gaming', '7th', 'gen', 'intel', 'core', 'i7', '-', \
              'new']
COMPANY_NAMES = ['hp', 'asus', 'dell', 'apple', 'alienware', 'lenovo', 'razer', 'acer', \
                 'microsoft', 'huawei', 'samsung']


def query_info(laptop: str, model_id: str):
    '''

    :param laptop: name of the laptop, model_id
    :return: dictionary containing laptop attributes
    '''

    r = requests.post('https://noteb.com/api/webservice.php',
                      data={'apikey': "uHecmU3nkxBaj0C",
                            'method': "get_model_info",
                            'param[model_name]': laptop,
                            'param[model_id]': model_id},
                      verify=False)
    return json.loads(r.text)


def find_attributes(laptop_dict: dict):
    '''

    :param laptop_dict: dictionary from post request using noteb API
    :return: storage capacity, screen size, resolution, operating system, ram,
            model year, cpu, cores, color
    '''
    try:
        release_date = laptop_dict['result']['0']['model_resources']['launch_date']

        battery_life = laptop_dict['result']['0']['battery_life_hours'].split(':')
        battery_life = str(battery_life[0]) + ' hours ' + str(battery_life[1]) + ' minutes'

        op_system = laptop_dict['result']['0']['operating_system']
        op_system = op_system.replace("10.00", "10")

        storage_capacity = laptop_dict['result']['0']['total_storage_capacity']
        storage_capacity += ' GB'

        colors = laptop_dict['result']['0']['chassis']['colors']

        screen_size = laptop_dict['result']['0']['display']['size']
        screen_size += ' inches'

        horizontal_resolution = laptop_dict['result']['0']['display']['horizontal_resolution']
        vertical_resolution = laptop_dict['result']['0']['display']['vertical_resolution']
        resolution = str(horizontal_resolution) + ' X ' + vertical_resolution + ' pixels'

        touchscreen = laptop_dict['result']['0']['display']['touch']

        battery_type = laptop_dict['result']['0']['battery']['cell_type']
        battery_type = battery_type.replace('Li-Ion', 'Lithium-Ion')

        ram = laptop_dict['result']['0']['memory']['size']
        ram += ' GB'

        if 'gpu' in laptop_dict.keys():
            gpu = laptop_dict['result']['0']['gpu']['model']
        else:
            gpu = 'None'

        cpu = laptop_dict['result']['0']['cpu']['prod'] + ' ' + laptop_dict['result']['0']['cpu']['model']
        cpu_cores = laptop_dict['result']['0']['cpu']['cores']

        return {
            'battery_life': battery_life,
            'release_date': release_date,
            'operating_system': op_system,
            'colors': colors,
            'screen_size': screen_size,
            'resolution:': resolution,
            'touchscreen': touchscreen,
            'battery_type': battery_type,
            'RAM': ram,
            'gpu': gpu,
            'cpu': cpu,
            'cores': cpu_cores
        }
    except Exception as e:
        print(e)
        return None


def get_attributes(laptop: str):
    '''
    combine query info and find attributes into one method
    '''
    laptop_dict = query_info(laptop)
    attributes = find_attributes(laptop_dict)
    return attributes


def clean_title(title):
    '''
    :param title of product on Amazon
    :return: product title (up to the first , or ( or | character
    '''

    if title is None:
        return None

    title = str(title).strip()
    try:
        title = re.search(r'.+?(?=[,(|\[\]])', laptop).group(0)
    except:
        pass

    short_title = ''
    for word in title.split():
        if word.lower() in STOP_WORDS:
            continue
        if len(word) < 10:
            short_title += ' ' + word

    return short_title


def find_company_name(title):
    for word in title.split():
        if word.lower() in COMPANY_NAMES:
            return word
    return None


if __name__=='__main__':
    # laptop = 'Dell i7577-7425BLK-PUS Inspiron UHD Display Gaming Laptop - 7th Gen Intel Core i7, GTX 1060 6GB Graphics, 16GB Memory, 128GB SSD + 1TB HDD, 15.6", Matte Black'
    laptop = '2020 HP Pavilion 15.6 Inch Touchscreen Laptop| 10th Gen Intel Core i5-1035G1 (Beats i7-7500U)| 8GB RAM| 512GB PCIe SSD| WiFi| Bluetooth| Webcam| Windows 10 Professional + NexiGo Wireless Mouse'
    model_id = '838'
    cleaned_laptop = clean_title(laptop)
    print(cleaned_laptop)
    laptop_dict = query_info(laptop=cleaned_laptop, model_id=model_id)
    attributes = find_attributes(laptop_dict)
    print(json.dumps(attributes, indent = 4))