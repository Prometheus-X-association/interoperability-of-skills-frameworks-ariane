import streamlit as st
import json
import random
import numpy as np
from sentence_transformers import SentenceTransformer
from elasticsearch import Elasticsearch
import pandas as pd
import tqdm as tqdm
import torch

################################### ALL VARIABLES INITIALIZATION #############################################################

def initialize():
    st.session_state["formations"] = json.load(open("app/data/formationGEN/sample.json","r"))
    st.session_state['current_index'] = 0
    st.session_state["embeddings"] = torch.load("app/data/formationGEN/sample.pt")

    #Connection au client ElasticSearch
    try:
        st.session_state.es = Elasticsearch(cloud_id="My_deployment:ZXVyb3BlLXdlc3QxLmdjcC5jbG91ZC5lcy5pbyQ0N2JhMTAxNjhmMzg0M2MwODE1YTU4MzMxZTEwYTc5OSQ1ZDY0YTg0YzI3MjU0NjA1YTg1OWYwNTcwZDRiZTI3MA==",
                    api_key=("4M42-IgBTdLMf-o42MtL","u2FMsPOUSv2RBwnQXxsC6g"))
        print("ElasticSearch OK")
    except:
        print("Erreur connexion ElasticSearch")
        
    st.session_state.model = SentenceTransformer("Sahajtomar/french_semantic")

def skillMatch(vector,text):
    query = {
    "bool": {
        "must": [
            {
                "script_score": {
                    "query": {"match_all": {}},
                    "script": {
                        "source": "cosineSimilarity(params.query_vector, 'vector') + 1.0",
                        "params": {
                            "query_vector": vector
                        }
                    }
                }
            },
            {
                "match": {
                    "type": "rome:alias/Skill_rome"
                }
            },
            ### Matching BM25
            # {
            #     "match": {
            #         "description": text
            #     }
            # }
        ]
    }
}

    response = st.session_state.es.search(index=".ent-search-engine-documents-ariane-first-test",query=query,source=["pref_label__value"],size=100)

    return [(res["_score"]/5,res["_id"],res["_source"]["pref_label__value"]) for res in response["hits"]["hits"]]



################################### SIDEBAR DISPLAY #############################################################


def displaySidebar():

    st.sidebar.header("Use Cases",divider="red")
    st.sidebar.button("GEN",use_container_width=True,disabled=False)

    st.sidebar.header("Data Provider",divider="red")
    st.sidebar.info("GEN")

    st.sidebar.header("Catalogue",divider="red")
    st.sidebar.selectbox("Select your Item",st.session_state.formations,index=st.session_state['current_index'],format_func=lambda x:x["title"],key="selectedFormation")
    st.sidebar.file_uploader("Coming next - upload your own",type="json",disabled=True)
    if st.session_state.selectedFormation != st.session_state['formations'][st.session_state['current_index']]:
        st.session_state['current_index'] = st.session_state['formations'].index(st.session_state.selectedFormation)
        
################################### TRAINING DISPLAY #############################################################

def displayFormation():
    with st.form("formation"):
        st.header(st.session_state.selectedFormation["title"],divider="red")
        
        l,m,r = st.columns(3)
        l.success(st.session_state.selectedFormation["job_trained_for"])
        m.success(st.session_state.selectedFormation["education_level_targeted"])
        r.success(st.session_state.selectedFormation["training_organization"])
        with st.expander("Description",expanded=True):
            st.write(st.session_state.selectedFormation["description"])
        l,r = st.columns(2)
        l.info(st.session_state.selectedFormation["duration"])
        r.info(st.session_state.selectedFormation["location"])
        if l.form_submit_button("Previous",use_container_width=True):
            update_index(-1)
            st.rerun()
        if r.form_submit_button("Next",use_container_width=True):
            update_index(1)
            st.rerun()
    
################################### DISPLAY SUGGESTIONS #############################################################

def displayRome():
    st.header("Rome Skills",divider="red")

    skilltype=st.selectbox("Select Skill Type",["skill","knowledge",""])

    sugg,val = st.tabs(["Suggested","Validated"])

    with sugg:
        vector = st.session_state.embeddings[st.session_state.selectedFormation["title"]]
        suggs = skillMatch(vector,st.session_state.selectedFormation["description"])
        for (score,id,label) in suggs:
            ids,labels,scores = st.columns([1,3,1])
            ids.success(f"ROME / skill / {id[-6:]}")
            labels.info(label)
            scores.success(f"{int(1000*score)/10} %")
                
    with val:
        b=0


################################### UTILS #############################################################

def update_index(change):
    st.session_state['current_index'] += change
    st.session_state['current_index'] %= len(st.session_state['formations']) 

################################### APP LOGIC #############################################################

def skillExtraction():
    st.set_page_config(layout='wide')
    st.title("Training Enhancing Tool")
    if "formations" not in st.session_state:
        initialize()
    # st.markdown(st.session_state.css, unsafe_allow_html=True)
    displaySidebar()
    displayFormation()
    displayRome()

if __name__ == "__main__":
    skillExtraction()