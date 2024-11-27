import streamlit as st
import json

################### PARSING FILE #############################

def parseField(item, field, stringPath=""):
    value = item[field]
    if isinstance(value, list) and len(value) > 0:
        if isinstance(value[0], dict):
            fieldList = value[0].keys()
            for nestedField in fieldList:
                newStringPath = f"{stringPath}.{field}" if stringPath else field
                parseField(value[0], nestedField, newStringPath)
        else:
            newStringPath = f"{stringPath}.{field}" if stringPath else field
            st.session_state.fieldList.append(newStringPath)
    elif isinstance(value, dict):
        fieldList = value.keys()
        for nestedField in fieldList:
            newStringPath = f"{stringPath}.{field}" if stringPath else field
            parseField(value, nestedField, newStringPath)
    else:
        newStringPath = f"{stringPath}.{field}" if stringPath else field
        st.session_state.fieldList.append(newStringPath)

def parseFile():
    st.session_state.data = json.load(st.session_state.raw_data)
    st.session_state.fieldList = []
    first_item = st.session_state.data[0] if isinstance(st.session_state.data, list) else st.session_state.data
    fieldList = [key for key in first_item.keys()]
    for field in fieldList:
        with st.container():
            parseField(first_item,field)
    return fieldList

######################### SIDEBAR #########################################

def check_and_create_buttons():
    # Vérifiez si `mappingList` est dans le session state
    if 'mappingList' not in st.session_state:
        st.warning("La liste de mappage (mappingList) n'est pas disponible.")
        return

    mappingList = st.session_state['mappingList']
    skills_with_description = False
    experience_with_description = False
    exp = None

    for rule in mappingList:
        target_class = rule.get("targetClass", "")
        target_property = rule.get("targetProperty", "")
        target_value = rule.get("targetValue", "")

        # Vérifiez les conditions pour chaque classe
        if target_class == "soo:Skill" and target_property == "description":
            skills_with_description = True

        if target_class == "soo:Experience" and target_property == "description":
            experience_with_description = True

        if target_value == "term:experience/type/professional":
            exp = "Pro"
        elif target_value == "term:experience/type/educationnal":
            exp = "Course"

    l,r = st.columns(2)

    # Affichez les boutons correspondants si les conditions sont remplies
    if skills_with_description:
        
        if l.button("Matcher les skills",use_container_width=True):
            # Enregistrer les données nécessaires dans le session_state
            st.session_state.data_to_match = extract_descriptions()
            # Naviguer vers la page de matching
            st.switch_page("pages/3_Matching_Tool_-_Skills.py")


    if experience_with_description:
        if exp == "Pro":
            if r.button("Matcher les expériences",use_container_width=True):
                # Enregistrer les données nécessaires dans le session_state
                st.session_state.data_to_match = extract_descriptions()
                # Naviguer vers la page de matching
                st.switch_page("pages/2_Matching_Tool_-_Jobs.py")
            
        elif exp == "Course":
            if r.button("Tagger les formations",use_container_width=True):
                # Enregistrer les données nécessaires dans le session_state
                st.session_state.matching_type = 'formations'
                st.session_state.data_to_match = extract_descriptions()
                # Naviguer vers la page de matching
                st.switch_page("pages/4_Enhancement_Tool_-_Courses.py")
                st.rerun()

def get_nested_value(data, field_path, default=""):
    """
    Access a nested field in a dictionary based on a flattened field path (e.g., 'skill.description').
    Returns the value or a default if the field does not exist.
    """
    keys = field_path.split(".")
    for key in keys:
        if isinstance(data, dict) and key in data:
            data = data[key]
        else:
            return default
    return data

def get_nested_value(data, field_path, default=""):
    """
    Access a nested field in a dictionary based on a flattened field path (e.g., 'skill.description').
    Returns the value or a default if the field does not exist.
    """
    keys = field_path.split(".")
    for key in keys:
        if isinstance(data, dict) and key in data:
            data = data[key]
        else:
            return default
    return data

def extract_descriptions():
    extracted_data = {
        "experiences": {},
        "skills": {}
    }

    mappingList = st.session_state['mappingList']
    data = st.session_state['data']

    # Determine field mappings dynamically
    experience_pref_label_field = None
    experience_family_field = None
    experience_description_fields = []
    
    skill_pref_label_field = None
    skill_id_field = None
    skill_description_fields = []

    for rule in mappingList:
        target_class = rule.get("targetClass")
        target_property = rule.get("targetProperty")
        source_path = rule.get("sourcePath")
        
        if target_class == "soo:Experience":
            if target_property == "prefLabel":
                experience_pref_label_field = source_path
            elif target_property == "description":
                experience_description_fields.append(source_path)
            elif target_property == "family":
                experience_family_field = source_path
        elif target_class == "soo:Skill":
            if target_property == "prefLabel":
                skill_pref_label_field = source_path
            elif target_property == "description":
                skill_description_fields.append(source_path)
            elif target_property == "sourceSkillId":
                skill_id_field = source_path

    # Process experiences
    for idx, experience in enumerate(data):
        experience_id = f"experience-{idx}"
        pref_label_value = get_nested_value(experience, experience_pref_label_field, "")
        family_value = get_nested_value(experience, experience_family_field, "")
        
        # Gather and flatten descriptions
        descriptions = []
        for field in experience_description_fields:
            field_value = get_nested_value(experience, field, [])
            if isinstance(field_value, list):
                descriptions.extend(field_value)
            elif isinstance(field_value, str):
                descriptions.append(field_value)
        combined_description = " ".join([desc for desc in descriptions if desc])
        
        extracted_data["experiences"][experience_id] = {
            "pref_label_value": pref_label_value,
            "description": combined_description,
            "family": family_value
        }

        # Process skills within experiences
        skills = get_nested_value(experience, "skills", [])
        for skill in skills:
            skill_id = get_nested_value(skill, skill_id_field, f"skill-{idx}-{len(extracted_data['skills'])}")
            if skill_id in extracted_data["skills"]:
                continue
            pref_label_value = get_nested_value(skill, skill_pref_label_field, "")
            
            # Gather and flatten descriptions
            descriptions = []
            for field in skill_description_fields:
                field_value = get_nested_value(skill, field, [])
                if isinstance(field_value, list):
                    descriptions.extend(field_value)
                elif isinstance(field_value, str):
                    descriptions.append(field_value)
            combined_description = " ".join([desc for desc in descriptions if desc])

            extracted_data["skills"][skill_id] = {
                "pref_label_value": pref_label_value,
                "description": combined_description
            }

    return extracted_data



def get_value_from_data(data, source_path):
    keys = source_path.split('.')
    for key in keys:
        if isinstance(data, list):
            data = data[0]
        if key in data:
            data = data[key]
        else:
            return None
    return data

def displaySidebar():
    with st.sidebar:

        st.header("Data Provider", divider="red")
        st.info(st.session_state.edTechID)

        st.header("File", divider="red")
        if 'fieldList' in st.session_state and st.session_state.fieldList:
            with st.expander("Fields",expanded=True):
                for field in st.session_state.fieldList[:-1]:
                    st.write(f"   ├─ {field} \n")
                st.write(f"   └─ {st.session_state.fieldList[-1]} \n")

        check_and_create_buttons()

####################### OBJECT CREATION & DISPLAY #################################

def createTab():
    st.header("Create your objects",divider="red")
    c,h = st.columns([1,2])
    with c:
        create_item_form()
    with h:
        if st.session_state.submitted:
            handle_item_submission()
    st.header("Your Objects",divider="red")
    display_existing_items()

def create_item_form():
    with st.form("Item type"):
        st.header("Add a new item:", divider="red")
        l,r = st.columns([3,1])
        l.selectbox("Select your Object type and language", ["Experience", "Skill", "Polarity","Profile"], key="selectedType")
        r.selectbox("Select",["en","de","fr","es","it","re","tr","pl","ro"],key="language",label_visibility="hidden")
        st.text_input("Name your Object", placeholder=f"Object Name", help="Name your Object", key="objectName")
        if st.form_submit_button("Confirm", use_container_width=True) : 
            if st.session_state.objectName:
                st.session_state.submitted = True
            else:
                st.error("An object need a name to be created")

def handle_item_submission():
    with st.form("property match"):
        st.header("Define mandatory properties", divider="red")
        item = {
            "class" : st.session_state.selectedType,
            "name" : st.session_state.objectName,
            "language" : st.session_state.language
        }
        for property,values in st.session_state[st.session_state.selectedType]:
            name,value = st.columns(2)
            name.info(property)
            item[property] = value.selectbox("type",values,label_visibility="collapsed",format_func=str.capitalize,key=f"{property}_value")
            
        if st.form_submit_button("Create",use_container_width=True):
            st.session_state.itemList.append(item)
            st.session_state.submitted = False
            st.rerun()

def display_existing_items():
    cols = st.columns(5)
    cols[0].header("Classe",divider="red")
    cols[1].header("Name",divider="red")
    cols[2].header("Language",divider="red")
    for i in range(3,5):
        cols[i].header(f"Property {i-2}",divider="blue")
    
    for item in st.session_state.itemList:
        cols[0].success(item["class"])
        cols[1].info(item["name"])
        cols[2].info(item["language"])
        for i,(property,_ )in enumerate(st.session_state[item["class"]]):
            cols[i+3].info(item[property])
        for i in range(2-len(st.session_state[item["class"]])):
            cols[4-i].info("None")

########################## RULES CREATION & DISPLAY #####################################

def matchingTab():
    st.header("Map your fields",divider="red")
    create_mapping_form()
    st.header("Your Rules",divider="red")
    display_existing_rules()

def create_mapping_form():
    cols = st.columns(3)
    names = ["Field","Object","Property"]
    for i in range(3):
        cols[i].subheader(names[i],divider="red")
        
    for field in st.session_state.fieldList: 
        if field not in st.session_state.mapped:
            createMatchingForm(field)
        
    if st.button("Create Rules",use_container_width=True):
        for field in st.session_state.fieldList :
            if  field not in st.session_state.mapped and st.session_state.get(f"object_{field}", {}).get("name") != "No Mapping":
                create_rule(field)
        st.rerun()

def create_rule(field):
    if st.session_state.get(f"generateID_{field}", False) and st.session_state[f'object_{field}']['class'] == 'Experience':
            id_rule = {"id": f"mmr:rule-{len(st.session_state.mappingList)}",
                    "sourcePath": field,
                    "targetClass": f"soo:{st.session_state[f'object_{field}']['class']}",
                    "generateId": "true"}
                    
            st.session_state.mappingList.append(id_rule)
            
            type_rule = {
                            "id": f"mmr:rule-{len(st.session_state.mappingList)}",
                            "sourcePath": field,
                            "targetClass": "soo:Experience",
                            "targetProperty": "soo:experienceType",
                            "targetValue": f"term:experience/type/{st.session_state[f'object_{field}']['type'].replace(' ','')}"
                        }
                    
            st.session_state.mappingList.append(type_rule)
            
            status_rule =  {
                        "id": f"mmr:rule-{len(st.session_state.mappingList)}",
                        "sourcePath": field,
                        "targetClass": "soo:Experience",
                        "targetProperty": "soo:experienceStatus",
                        "targetValue": f"term:experience/type/{st.session_state[f'object_{field}']['status']}"
                    }
                    
            st.session_state.mappingList.append(status_rule)
    if st.session_state.get(f"generateID_{field}", False) and st.session_state[f'object_{field}']['class'] == 'Skill':

        id_rule ={"id": f"mmr:rule-{len(st.session_state.mappingList)}", 
                        "sourcePath": field,
                        "targetClass": f"soo:{st.session_state[f'object_{field}']['class']}",
                        "generateId" : "true",
                        "targetProperty": "soo:category",
                        "targetValue" : "term:skills/category/riasec",
                        "relationTo" : "soo:Experience",
                        "relationName" : "soo:experience",
                        "relationNameInverse" : "soo:skill"}
        st.session_state.mappingList.append(id_rule)
        
        
    rule = {"id": f"mmr:rule-{len(st.session_state.mappingList)}",
            "sourcePath": field,
            "targetClass": f"soo:{st.session_state[f'object_{field}']['class']}",
            "targetProperty": st.session_state[f'property4{field}']}
    
    if st.session_state.get(f"generateID_{field}", False) and st.session_state[f'object_{field}']['class'] == 'Profile':
        rule["generateId"] = "true"

        rule["relationTo"] = "soo:Experience"
        rule["relationName"] = "soo:containsExperience"
        rule["relationNameInverse"] =  "soo:hasProfile"
   
    if st.session_state[f'property4{field}'] == "soo:result":
        rule['targetFunction'] = "fno:skill-value-to-scale"
        
    if st.session_state[f'property4{field}'] == "skos:prefLabel":
        rule['targetFunction'] = "fno:asIs_WithLang"
        rule[ "targetLang"] = st.session_state[f"object_{field}"]["language"]
    
    if st.session_state[f'property4{field}'] == "soo:date":
        rule['targetFunction'] = "fno:date-to-xsd"
        
    st.session_state.mappingList.append(rule)
    st.session_state.mapped.append(field)

def createMatchingForm(field):
    f,o,p,t = st.columns([5,5,5,1])
    f.info(field)
    o.selectbox("object",[{"name" : "No Mapping"}] + st.session_state.itemList, format_func=lambda x:x["name"],key=f"object_{field}",label_visibility="collapsed")
    if st.session_state[f"object_{field}"]["name"] != "No Mapping":
        properties = st.session_state.soo_data_model[st.session_state[f"object_{field}"]["class"]]
        p.selectbox("Propriété",properties,key=f"property4{field}",label_visibility="collapsed")
    else:
        p.selectbox("Propriété",[],key=f"property4{field}",label_visibility="collapsed")
    t.checkbox("ID",key = f"generateID_{field}")

def display_existing_rules():
    ruleFile = {"@context": {
                        "todo": "define_the_rules_context"
                    },
                "graph": st.session_state.mappingList}
    st.code(json.dumps(ruleFile,indent=4)) 

########################## APP LOGIC #####################################
def main():
    st.title("Mapping Page")
    if not('raw_data' in st.session_state and not(st.session_state.raw_data is None)):
        st.warning("Uploadez d'abord vos fichiers dans l'onglet Accueil")
    else:
        if "fieldList" not in st.session_state:
            parseFile()
            st.rerun()
        else:
            displaySidebar()
            tabs = st.tabs(["Object Creation","Field Mapping"])
            with tabs[0]:
                createTab()
            with tabs[1]:
                matchingTab()

if __name__ == "__main__":
    main()
