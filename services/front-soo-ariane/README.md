# Skills Interoperability Front - Software v0.5

This repository is the release v0.5 of the skills interoperability software. It represents the development of the front that have been done during the project.

This front is divided in 3 human computer interfaces :
- "Onthology Matching Tool", that allows users (such as startups and academia) to align their onthology to Ariane Pivot Onthology.
- "Framework Matching Tool", that allows users to align their referential to standard Framework such as ROME and ESCO.
- "Training Enhancing Tool", that allows users to "enrich" their trainings and courses with skills and skill blocks from standard frameworks such as ROME, ESCO and RNCP.


# Run it

## local 

- create the virtual env if not exist: 
```
python3 -m venv venv-soo . 
```

- activate the virtual env: 
```
source venv-soo/bin/activate
```
- install:
```
pip install -r requirements.txt
```

- create the `.env` file in the current folder
```
cp .env.tmp .env
# copy/paste your access tokens or get them from the note named: `soo-env-[env-name]` in the "Tech-pwd" password vault.
```

- run it : 
```
streamlit run app/Home.py --server.port 8080
```

## docker
- `docker compose up` 

- then go to the URL specified in the logs (should be 127.0.0.1:8080)

This container can be deployed on any host, given relevant port adjustements
