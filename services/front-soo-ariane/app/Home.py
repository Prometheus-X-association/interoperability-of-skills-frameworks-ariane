import streamlit as st
from sentence_transformers import SentenceTransformer
from elasticsearch import Elasticsearch
import json
from pathlib import Path
from dotenv import load_dotenv
import os
load_dotenv()


def initialization():
    st.session_state.edTechID = "edTechID"
    st.session_state.Experience = [("type", ["educational", "professional", "vocational", "personnality Test"]), ("status", ["past", "ongoing", "suggested"])]
    st.session_state.Skill = []
    st.session_state.Polarity = []
    st.session_state.Profile = []

    st.session_state.soo_data_model = {
        "Experience": {
            "prefLabel": "rdf:langstring",
            "description": "soo:Description",
            "experienceType": "skos:Concept",
            "experienceStatus": "skos:Concept",
            "dateFrom": "xsd:date",
            "dateTo": "xsd:date",
            "profile": "soo:Profile",
            "company": "xsd:string",
            "location": "xsd:string",
            "contractType": "xsd:string",
            "family": "soo:Family",
            "sourceId": "xsd:string",
            "polarity": "soo:Polarity",
            "skill": "soo:Skill",
            "sourceDataValue": "soo:SourceDataJson",
        },
        "Skill": {
            "experience": "soo:Experience",
            "prefLabel": "rdf:langstring",
            "description": "xsd:string",
            "category": "skos:Concept",
            "skillLevelScale": "skos:OrderedCollection",
            "skillLevelValue": "skos:Concept",
            "sourceSkillId": "skos:Concept",
        },
        "Polarity": {
            "experience": "soo:Experience",
            "polarityScale": "skos:OrderedCollection",
            "polarityValue": "skos:Concept",
        },
        "Profile": {
            "name": "xsd:string",
            "email": "xsd:string",
            "experience": "soo:Experience",
            "address": "xsd:string",
        },
        "Family": {
            "prefLabel": "rdf:langstring",
            "memberOf": "skos:Collection",
            "provider": "xsd:string",
        },
        "Description": {
            "texte": "rdf:langstring",
            "url": "xsd:string",
            "keywords": "rdf:langstring",
            "imagePath": "xsd:string",
        },
        "SourceDataJson": {
            "value": "rdf:JSON",
        }
    }
    st.session_state.itemList = []
    st.session_state.mappingList = []
    st.session_state.mapped = []
    st.session_state.submitted = False
    
    cloud_id = os.getenv('ES_CLOUD_ID')
    api_key_1 = os.getenv('ES_API_KEY_1')
    api_key_2 = os.getenv('ES_API_KEY_2')
    print('env vars', cloud_id, '///////////:', api_key_1)
    
    st.session_state.ES = Elasticsearch(
        cloud_id=cloud_id, api_key=(api_key_1, api_key_2)
    )
    st.session_state['initialized'] = True
    st.session_state.rome_names = json.load(open("app/data/ROME/ROME_names.json", "rb"))
    
    with st.spinner("Charging model ..."):
        model_identifier = "Sahajtomar/french_semantic"
        cwd = Path(__file__).parent
        modelPath = f"{cwd}/data/model"

        if not os.path.exists(f"{modelPath}/config.json"):
            print('--> Start downloading model to:', modelPath)
            model = SentenceTransformer(model_identifier)
            print('--> download ok')
            model.save(modelPath)
        else:
            print('--> Model is locally available, proceed.')
            model = SentenceTransformer(modelPath)
        st.session_state.model = SentenceTransformer("app/data/model")
        st.rerun()

def main():
    st.set_page_config(page_title="Onthology Mapping", layout="wide")
    
    if 'initialized' not in st.session_state:
        initialization()
    
    st.title("Accueil")
    st.write("Bienvenue sur l'application de mapping et matching.")
    if "raw_data" not in st.session_state:
        st.session_state.raw_data = None

    file = st.file_uploader("Rentrez votre fichier de données au format JSON standard.",type="json",key="file")
    
    if file is not None:
        st.session_state.raw_data = file
        st.success("You can proceed to the next interface")

    if st.sidebar.button("Reset",use_container_width=True):
        initialization()
        st.rerun()

if __name__ == "__main__":
    main()