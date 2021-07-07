git_token = "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"
acc_owner = "FaizanAkhtar0"
query_url = f"https://api.github.com/users/{acc_owner}/repos"
params = {"state": "open"}
headers = {'Authorization': f'token {git_token}'}

