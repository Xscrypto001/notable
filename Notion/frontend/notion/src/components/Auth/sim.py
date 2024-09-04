import requests
import json

# Configuration
API_URL = "https://insights.sandbox.africastalking.com/v1/sim-swap"
API_KEY = "atsk_b8e087a1773010f4973d45305aa3cb5b63daa34ee25cb15458b67e7429aa739822457884"
PHONE_NUMBER = "+254740491950"  # Phone number to check

def check_sim_swap_status(phone_number):
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'apiKey': 'atsk_0c41683d1a04f9822127af8dfb80df988dbcbceca6b9efb8a6183f4866ace449c7c6256d'
    }
    payload = {
        'sandbox': 'sandbox',
        'phoneNumbers': [phone_number]
    }
    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        swap_status_response = response.json().get('status')
        swap_status = swap_status_response == 'swapped'
    else:
        swap_status = False

    return swap_status

def save_to_file(phone_number, swap_status):
    result = {
        'phone_number': phone_number,
        'swap_status': swap_status
    }
    with open('sim_swap_status.json', 'w') as file:
        json.dump(result, file, indent=4)

if __name__ == "__main__":
    swap_status = check_sim_swap_status(PHONE_NUMBER)
    save_to_file(PHONE_NUMBER, swap_status)
    print(f"SIM swap status for {PHONE_NUMBER} saved to sim_swap_status.json")
