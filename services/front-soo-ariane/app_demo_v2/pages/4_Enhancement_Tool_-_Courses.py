import streamlit as st
import json
import torch
from sentence_transformers import SentenceTransformer
from elasticsearch import Elasticsearch
import pandas as pd
import numpy as np
################################### INITIALIZATION #############################################################

def initialize():
    st.session_state["formations"] = json.load(open("app/data/formationGEN/sample.json", "r"))
    st.session_state["embeddings"] = torch.load("app/data/formationGEN/sample.pt")
    if "target" not in st.session_state:
        st.session_state.target = "ROME"

    # ElasticSearch connection
    st.session_state.es = Elasticsearch(
        cloud_id="My_deployment:ZXVyb3BlLXdlc3QxLmdjcC5jbG91ZC5lcy5pbyQ0N2JhMTAxNjhmMzg0M2MwODE1YTU4MzMxZTEwYTc5OSQ1ZDY0YTg0YzI3MjU0NjA1YTg1OWYwNTcwZDRiZTI3MA==",
        api_key=("4M42-IgBTdLMf-o42MtL", "u2FMsPOUSv2RBwnQXxsC6g"),
    )

    st.session_state.model = SentenceTransformer("Sahajtomar/french_semantic")
    st.session_state["validated_skills"] = pd.DataFrame(columns=["Formation Title", "Skill ID", "Skill Label"])
    st.session_state["added_formations"] = []
    st.session_state["bias"] = json.load(open("app/data/formationGEN/bias.json"))
################################### SKILL MATCHING #############################################################

@st.cache_data
def skill_match(formation_title, target_framework):
    # Get the formation vector
    adjusted_vector = (np.array(st.session_state.embeddings[formation_title]) - 0.5 * np.array(st.session_state.bias)).tolist()

    # Determine the type to match based on the target framework
    if target_framework == "ESCO":
        type_match = {"match": {"type": "esco:Skill"}}
    else:  # Default to ROME
        type_match = {"match": {"type": "rome:alias/Skill_rome"}}

    # Elasticsearch query
    query = {
        "bool": {
            "must": [
                {
                    "script_score": {
                        "query": {"match_all": {}},
                        "script": {
                            "source": "cosineSimilarity(params.query_vector, 'vector') + 1.0",
                            "params": {"query_vector": adjusted_vector},
                        },
                    }
                },
                type_match,
            ]
        }
    }

    response = st.session_state.es.search(
        index=".ent-search-engine-documents-ariane-first-test",
        query=query,
        source=["pref_label__value"],
        size=100,
    )

    return [
        {
            "Skill ID": f"{target_framework} / skill / {res['_id'][-6:]}",
            "Skill Label": res["_source"]["pref_label__value"],
            "Score": round(res["_score"] / 5 * 100, 2),
        }
        for res in response["hits"]["hits"]
    ]


################################### SIDEBAR #############################################################

def display_sidebar():
    st.sidebar.header("Use Cases", divider="red")
    st.sidebar.button("GEN", use_container_width=True)

    st.sidebar.header("Data Provider", divider="red")
    st.sidebar.info("GEN")

    st.sidebar.header("Target Framework", divider="red")
    st.sidebar.selectbox(
        "Select Target Framework",
        ["ROME", "ESCO"],
        key="target"
    )

    st.sidebar.header("Catalogue", divider="red")

    # Create a placeholder for the selectbox
    selectbox_placeholder = st.sidebar.empty()

    # Add New Formation in the sidebar using an expander
    with st.sidebar.popover("Add New Formation",use_container_width=True),st.form("Add New Formation",border=False,clear_on_submit=True):
        # Initialize session state keys if not already present
        if "new_formation_title" not in st.session_state:
            st.session_state.new_formation_title = ""
        if "new_formation_description" not in st.session_state:
            st.session_state.new_formation_description = ""

        title = st.text_input("Title", key="new_formation_title")
        description = st.text_area("Description", key="new_formation_description")

        if st.form_submit_button("Add Formation"):
            if title and description:
                new_formation = {
                    "title": title,
                    "description": description,
                    "job_trained_for": "",
                    "education_level_targeted": "",
                    "training_organization": "",
                    "duration": "",
                    "location": "",
                }
                if "added_formations" not in st.session_state:
                    st.session_state["added_formations"] = []
                st.session_state["added_formations"].append(new_formation)
                # Update embeddings for the new formation
                new_vector = st.session_state.model.encode(description)
                st.session_state.embeddings[title] = new_vector

                # Automatically select the new formation
                st.session_state.selectedFormationTitle = title

                st.rerun()
            else:
                st.warning("Please provide both a title and description.")

    # Now, instantiate the selectbox after the formation creation code
    all_formations = st.session_state["formations"] + st.session_state.get("added_formations", [])
    formation_titles = [formation["title"] for formation in all_formations]
    if "selectedFormationTitle" in st.session_state:
        selected_title = selectbox_placeholder.selectbox(
            "Select your Item",
            formation_titles,
            index=formation_titles.index(st.session_state.get("selectedFormationTitle", formation_titles[0])),
            key="selectedFormationTitle",
        )
    else:
        selected_title = selectbox_placeholder.selectbox(
            "Select your Item",
            formation_titles,
            index=0,
            key="selectedFormationTitle",
        )
        
    # Update the selected formation based on the selected title
    st.session_state.selectedFormation = next((f for f in all_formations if f["title"] == selected_title), None)

################################### TRAINING DISPLAY #############################################################

def display_formation():
    st.header("Formation Details", divider="red")
    st.write(" ")

    # Display existing formation details
    if st.session_state.selectedFormation:
        st.subheader(st.session_state.selectedFormation["title"], divider="blue")
        st.write(st.session_state.selectedFormation.get("description", "No description available."))

################################### ROME SKILLS #############################################################

def display_rome_skills():
    st.header("Skills", divider="red")

    formation_title = st.session_state.selectedFormation["title"]

    # Get skill suggestions and store them in session state
    if (
        "suggestions_df" not in st.session_state
        or formation_title != st.session_state.get("last_formation_title", None)
        or st.session_state.target != st.session_state.get("last_target_framework", None)
    ):
        suggestions = skill_match(formation_title, st.session_state.target)
        suggestions_df = pd.DataFrame(suggestions)
        st.session_state.suggestions_df = suggestions_df
        st.session_state.last_formation_title = formation_title
        st.session_state.last_target_framework = st.session_state.target
    else:
        suggestions_df = st.session_state.suggestions_df

    # Display suggestions using st.dataframe with on_select
    st.subheader("Suggested Skills")
    if not suggestions_df.empty:
        # Render the dataframe and capture the selection data
        selection = st.dataframe(
            suggestions_df,
            use_container_width=True,
            on_select="rerun",
            selection_mode="multi-row",
            key="suggestions_dataframe",
        )

        # Access the selected rows from the return value
        if "selection" in selection:
            selected_rows = selection["selection"]
        else:
            selected_rows = []

        # Process validated skills when the button is clicked
        if st.button("Validate Selected Skills"):
            if selected_rows:
                validated_skills = suggestions_df.iloc[selected_rows["rows"]].copy()
                # Keep only the necessary columns and add 'Formation Title'
                validated_skills = validated_skills[['Skill ID', 'Skill Label']]
                validated_skills['Formation Title'] = formation_title
                # Reorder columns if desired
                validated_skills = validated_skills[['Formation Title', 'Skill ID', 'Skill Label']]
                # Update the session state
                st.session_state["validated_skills"] = pd.concat(
                    [st.session_state["validated_skills"], validated_skills], ignore_index=True
                ).drop_duplicates(subset=["Formation Title", "Skill ID"])
                # Remove validated skills from suggestions
                st.session_state.suggestions_df = st.session_state.suggestions_df.drop(index=selected_rows["rows"])
                # Clear the selection (if necessary)
                st.success("Selected skills validated.")
                st.rerun()
            else:
                st.warning("No skills selected for validation.")
    else:
        st.write("No skill suggestions available.")

    # Display validated skills
    st.subheader("Validated Skills")
    validated_skills = st.session_state["validated_skills"]

    if not validated_skills.empty:
        st.dataframe(
            validated_skills,
            use_container_width=True,
        )
    else:
        st.write("No validated skills yet.")


            

################################### APP LOGIC #############################################################

def skill_extraction():
    st.set_page_config(layout="wide")
    st.title("Training Enhancing Tool")

    if "formations" not in st.session_state:
        initialize()

    display_sidebar()
    display_formation()
    display_rome_skills()

if __name__ == "__main__":
    skill_extraction()
