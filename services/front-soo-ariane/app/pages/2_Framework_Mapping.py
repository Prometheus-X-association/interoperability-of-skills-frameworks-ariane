import json
import pandas as pd
import streamlit as st
from elasticsearch import Elasticsearch
from stqdm import stqdm

################################### INITIALIZATION AND USE CASE ####################################################

def initialization():
    st.session_state.GEN = json.load(
        open("app/data/GEN/transformed_referentielGEN.json", "rb")
    )
    st.session_state.descs = json.load(open("app/data/GEN/descriptionsGEN.json"))
    st.session_state.select_spot = json.load(open("app/data/GEN/selectSpot.json"))
    st.session_state["confiance"] = 0
    st.session_state.current_spot = [0, 0, 0]  # Adjusted indices to start from 0
    st.session_state.rules = []
    # Initialize user_inputs_rome and user_inputs_esco as empty DataFrames
    st.session_state.user_inputs_rome = pd.DataFrame(columns=['Position', 'Matched Job', 'Match Type'])
    st.session_state.user_inputs_esco = pd.DataFrame(columns=['Position', 'Matched Job', 'Match Type'])
    st.session_state.total_positions = count_total_positions()
    st.session_state.target = "ROME"
    st.session_state.rome_names = json.load(open("app/data/ROME/ROME_names.json", "rb"))
    cloud_id = (
        "My_deployment:ZXVyb3BlLXdlc3QxLmdjcC5jbG91ZC5lcy5pbyQ0N2JhMTAxNjhmMzg0M2Mw"
        "ODE1YTU4MzMxZTEwYTc5OSQ1ZDY0YTg0YzI3MjU0NjA1YTg1OWYwNTcwZDRiZTI3MA=="
    )
    api_key_1 = "4M42-IgBTdLMf-o42MtL"
    api_key_2 = "u2FMsPOUSv2RBwnQXxsC6g"
    st.session_state.ES = Elasticsearch(
        cloud_id=cloud_id, api_key=(api_key_1, api_key_2)
    )

def count_total_positions():
    total = 0
    for sector in st.session_state.GEN.values():
        for job in sector.get("children", []):
            total += len(job.get("children", []))
    return total

################################### AUTOMATIC VALIDATION #############################################################

def automatic_validation():
    with st.spinner("Running Automatic Validation..."):
        progress = stqdm(
            desc="Iterating through the referential",
            total=st.session_state.total_positions,
            colour="red",
            unit="position",
        )
        for sector in st.session_state.GEN.values():
            for job in sector.get("children", []):
                for position in job.get("children", []):
                    suggestions = get_suggestions(position["prefLabel"][0]["@value"], framework=st.session_state.target)
                    for suggested_job, score in suggestions:
                        if score > st.session_state.threshold:
                            handle_match(position["prefLabel"][0]["@value"], suggested_job["pref_label__value"], "Match")
                    progress.update(1)

                
################################### DISPLAY SIDEBAR #############################################################

def display_sidebar():
    with st.sidebar:
        st.header("Use Cases", divider="red")
        st.button("GEN Framework", use_container_width=True)
        st.header("Data Provider", divider="red")
        st.info("GEN")
        st.header("Targeted Framework", divider="red")
        st.selectbox("Select Framework", ["ROME", "ESCO"], key="target")
        with st.form("Validate"):
            st.header("Automatic Validation", divider="red")
            st.slider("Validation Threshold", 2.0, 5.0, 3.5, 0.1, key="threshold")
            if st.form_submit_button("Valider", use_container_width=True):
                automatic_validation()

################################### DISPLAY USER FRAMEWORK ######################################################

def display_framework():
    d_col, m_col, p_col = st.columns(3)
    description = st.container()
    indices = list(st.session_state.current_spot)

    # Sectors
    sectors = list(st.session_state.GEN.values())
    sector_index = indices[0]

    selected_sector = d_col.selectbox(
        "Domaine",
        sectors,
        index=sector_index,
        format_func=lambda x: x["prefLabel"][0]["@value"],
        key="selected_sector",
    )

    # Jobs
    jobs = selected_sector.get("children", [])
    job_index = min(indices[1], len(jobs) - 1)

    selected_job = m_col.selectbox(
        "Métier",
        jobs,
        index=job_index,
        format_func=lambda x: x["prefLabel"][0]["@value"],
        key="selected_job",
    )

    # Positions
    positions = selected_job.get("children", [])
    position_index = min(indices[2], len(positions) - 1)

    selected_position = p_col.selectbox(
        "Poste",
        positions,
        index=position_index,
        format_func=lambda x: x["prefLabel"][0]["@value"],
        key="selected_position",
    )

    # Display description for the selected position
    with description:
        position_name = selected_position["prefLabel"][0]["@value"]
        st.header(position_name, divider="blue")
        st.info(st.session_state.descs.get(position_name, "No description available."))

################################### GET SUGGESTIONS #############################################################

def get_suggestions(position_name, framework):
    vector_response = st.session_state.ES.search(
        index="search-gen-jobs",
        query={"match": {"title": position_name}},
        size=1,
        _source=["vector"],
    )
    hits = vector_response.get("hits", {}).get("hits", [])
    if not hits:
        st.warning(f"No vector found for position '{position_name}'.")
        return []
    vector = hits[0]["_source"]["vector"]

    type_enum = {
        "ROME": ["rome:onto/Employment/Position"],
        "ESCO": ["esco:Occupation"],
    }

    query = {
        "bool": {
            "must": [
                {"terms": {"type.enum": type_enum[framework]}},
                {
                    "script_score": {
                        "query": {"match_all": {}},
                        "script": {
                            "source": "cosineSimilarity(params.query_vector, 'vector') + 1.0",
                            "params": {"query_vector": vector},
                        },
                    }
                },
                {"match": {
                    "pref_label__value": {
                        "query": position_name,
                        "boost": 0.05
                    }}},
            ]
        }
    }

    source_fields = (
        ["pref_label__value", "broader"] if framework == "ROME" else ["pref_label__value"]
    )

    response = st.session_state.ES.search(
        index=".ent-search-engine-documents-ariane-first-test",
        query=query,
        _source=source_fields,
        size=100,
    )

    if len(response["hits"]["hits"]) == 0:
        # Remove the match on pref_label__value
        query["bool"]["must"].pop(-1)
        response = st.session_state.ES.search(
            index=".ent-search-engine-documents-ariane-first-test",
            query=query,
            _source=source_fields,
            size=100,
        )

    return [(doc["_source"], doc["_score"]) for doc in response["hits"]["hits"]]

################################### DISPLAY FRAMEWORK SUGGESTIONS ################################################

def display_all_suggestions():
    position_name = st.session_state.selected_position["prefLabel"][0]["@value"]
    suggestions = get_suggestions(position_name, st.session_state.target)

    if len(suggestions) == 0:
        st.warning("No proposed match for this particular position")
    else:
        with st.container(height=500):
            for job, score in suggestions:
                with st.container(border=True):
                    display_suggestion(position_name, job, score)

def display_suggestion(position_name, job, score):
    l_col, r_col = st.columns([4, 1])
    y_col, proche_col, n_col = st.columns(3)

    key_prefix = f"{st.session_state.target}_{job['pref_label__value']}_{position_name}"

    if y_col.button(
        "Match Exact", key=f'y_{key_prefix}', use_container_width=True
    ):
        handle_match(position_name, job["pref_label__value"], "Match")
    if proche_col.button(
        "Close Match", key=f'c_{key_prefix}', use_container_width=True
    ):
        handle_match(position_name, job["pref_label__value"], "Close Match")
    if n_col.button(
        "No Match", key=f'n_{key_prefix}', use_container_width=True
    ):
        handle_match(position_name, job["pref_label__value"], "No Match")

    with l_col:
        match_status = get_match_status(position_name, job["pref_label__value"])
        color = match_status_to_color(match_status)
        st.subheader(f'{job["pref_label__value"]}', divider=color)
        if st.session_state.target == "ROME" and "broader" in job:
            # Display ROME-specific information
            domaine = job["broader"][0][-5:-4]
            famille = job["broader"][0][-5:-2]
            metier = job["broader"][0][-5:]
            st.caption(
                f'**Domaine:** {st.session_state.rome_names.get(domaine, domaine)} '
                f'**Famille:** {st.session_state.rome_names.get(famille, famille)} '
                f'**Métier:** {st.session_state.rome_names.get(metier, metier)}'
            )
    with r_col:
        st.metric("Score", round(score, 2))

def handle_match(position_name, job_title, match_type):
    if st.session_state.target == "ROME":
        df = st.session_state.user_inputs_rome
    else:
        df = st.session_state.user_inputs_esco

    # Check if the match already exists
    mask = (df['Position'] == position_name) & (df['Matched Job'] == job_title)
    if mask.any():
        # Update the existing row
        df.loc[mask, 'Match Type'] = match_type
    else:
        # Append new row
        new_row = pd.DataFrame({'Position': [position_name], 'Matched Job': [job_title], 'Match Type': [match_type]})
        df = pd.concat([df, new_row], ignore_index=True)
    if st.session_state.target == "ROME":
        st.session_state.user_inputs_rome = df
    else:
        st.session_state.user_inputs_esco = df

def get_match_status(position_name, job_title):
    if st.session_state.target == "ROME":
        df = st.session_state.user_inputs_rome
    else:
        df = st.session_state.user_inputs_esco

    mask = (df['Position'] == position_name) & (df['Matched Job'] == job_title)
    if mask.any():
        return df.loc[mask, 'Match Type'].iloc[0]
    else:
        return None

def match_status_to_color(status):
    return {
        None: 'gray',
        'Match': 'green',
        'Close Match': 'orange',
        'No Match': 'red',
    }.get(status, 'violet')

################################### DISPLAY MATCHING PROGRESSION ##################################################

def display_matching():
    st.header(f"Progression {st.session_state.target}", divider="red")
    if st.session_state.target == "ROME":
        df = st.session_state.user_inputs_rome
    else:
        df = st.session_state.user_inputs_esco

    matched_positions = df[df['Match Type'] == 'Match']['Position'].nunique()
    total = st.session_state.total_positions
    progress = matched_positions / total if total > 0 else 0
    st.progress(progress)
    st.write(f"{matched_positions} out of {total} positions matched.")

def display_matches():
    st.header(f"Matches for {st.session_state.target}", divider="red")
    st.caption("Delete rows by selecting them and clicking on the trash symbol on the upper right corner. Change a match status by clicking its 'Match Type' cell.")
    if st.session_state.target == "ROME":
        matches_df = st.session_state.user_inputs_rome.copy()
    else:
        matches_df = st.session_state.user_inputs_esco.copy()

    if not matches_df.empty:
        # Set up columns configuration
        columns_config = {
            'Position': st.column_config.Column(disabled=True),
            'Matched Job': st.column_config.Column(disabled=True),
            'Match Type': st.column_config.SelectboxColumn(
                options=['Match', 'Close Match', 'No Match']
            ),
        }

        edited_df = st.data_editor(
            matches_df,
            num_rows="dynamic",
            use_container_width=True,
            column_config=columns_config,
            key=f'data_editor_{st.session_state.target}',
            height=800,
        )


        # Detect deletions
        original_ids = matches_df.index
        edited_ids = edited_df.index
        deleted_ids = original_ids.difference(edited_ids)

        if not deleted_ids.empty:
            # Rows have been deleted
            if st.session_state.target == "ROME":
                st.session_state.user_inputs_rome = edited_df
            else:
                st.session_state.user_inputs_esco = edited_df

        else:
            # Update the session state with any changes
            if st.session_state.target == "ROME":
                st.session_state.user_inputs_rome = edited_df
            else:
                st.session_state.user_inputs_esco = edited_df

    else:
        st.write("No matches yet.")

################################### APP LOGIC #####################################################################

def framework_mapping():
    st.set_page_config(page_title="Framework Mapping Tool", layout="wide")
    st.title("Framework Mapping Tool")
    if "GEN" not in st.session_state:
        with st.spinner("Loading Frameworks"):
            initialization()
    display_sidebar()
    tabs = st.tabs(["Matching Interface","Matches"])
    with tabs[0]:
        col1, col2 = st.columns(2)
        st.divider()

        with col1:
            st.header("GEN Framework", divider="red")
            display_framework()
        with col2:
            st.header(f"{st.session_state.target} Framework", divider="red")
            display_all_suggestions()
        display_matching()
    with tabs[1]:
        display_matches()

if __name__ == "__main__":
    framework_mapping()
