import streamlit as st
import json
import requests
from time import sleep
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

# Define a TreeNode class to build the tree
class TreeNode:
    def __init__(self, name):
        self.name = name
        self.children = {}
        self.is_leaf = False  # Flag to indicate if it's a leaf node

def build_tree(field_list):
    root = TreeNode(None)
    for field in field_list:
        parts = field.split('.')
        current_node = root
        for i, part in enumerate(parts):
            if part not in current_node.children:
                current_node.children[part] = TreeNode(part)
            current_node = current_node.children[part]
            # If it's the last part, mark as leaf
            if i == len(parts) - 1:
                current_node.is_leaf = True
    return root

def build_display_lines(node, prefix=''):
    lines = []
    children = list(node.children.values())
    for i, child in enumerate(children):
        is_last = (i == len(children) -1)
        connector = '└─── ' if is_last else '├─── '
        line = prefix + connector + child.name
        lines.append(line)
        extension = '    ' if is_last else '│   '
        # If the child has children, recurse
        if child.children:
            lines.extend(build_display_lines(child, prefix + extension))
    return lines

def check_and_create_buttons():
    # Check if 'mappingList' is in the session state
    if 'mappingList' not in st.session_state:
        st.warning("La liste de mappage (mappingList) n'est pas disponible.")
        return

    mappingList = st.session_state['mappingList']
    skills_with_description = False
    experience_with_description = False
    formations_with_description = False

    # Collect rules that have 'targetProperty' == 'description'
    description_rules = [rule for rule in mappingList if rule.get("targetProperty") == "description"]

    # Process each description rule to determine its type
    for rule in description_rules:
        source_path = rule.get("sourcePath", "")
        relation_name_inverse = rule.get("relationNameInverse", "")
        source_root = source_path.split('.')[0]

        # Collect related rules sharing the same source root
        related_rules = [r for r in mappingList if r.get("sourcePath", "").startswith(source_root)]

        # Initialize variables
        experience_type = None
        is_skill = False

        # Check for 'soo:experienceType' in related rules
        for r in related_rules:
            target_property = r.get("targetProperty", "")
            target_value = r.get("targetValue", "")
            relation_name_inverse_r = r.get("relationNameInverse", "")

            if target_property == "soo:experienceType":
                if target_value == "term:experience/type/professional":
                    experience_type = "experiences"
                elif target_value == "term:experience/type/educational":
                    experience_type = "formations"

            if relation_name_inverse_r == "soo:skill":
                is_skill = True

        # Set flags based on the type
        if is_skill or relation_name_inverse == "soo:skill":
            skills_with_description = True
        elif experience_type == "experiences":
            experience_with_description = True
        elif experience_type == "formations":
            formations_with_description = True

    # If any descriptions are present, extract data
    if skills_with_description or experience_with_description or formations_with_description:
        extracted_data = extract_descriptions()
        
        st.session_state['data_to_match'] = extracted_data

def extract_descriptions():
    extracted_data = {
        "experiences": {},
        "formations": {},
        "skills": {}
    }

    mappingList = st.session_state['mappingList']
    data_list = st.session_state['data']

    # Group rules by the root of sourcePath
    def group_rules_by_source_root(mappingList):
        rules_by_root = {}
        for rule in mappingList:
            sourcePath = rule.get('sourcePath', '')
            if sourcePath:
                root = sourcePath.split('.')[0]
            else:
                # No sourcePath, perhaps only targetValue
                root = 'rootless'
            if root not in rules_by_root:
                rules_by_root[root] = []
            rules_by_root[root].append(rule)
        return rules_by_root

    rules_by_root = group_rules_by_source_root(mappingList)

    # Helper function to get nested values
    def get_nested_value(data_dict, source_path):
        keys = source_path.split('.')
        for key in keys:
            data_dict = data_dict[key]
        return data_dict

    # Process each data entry
    for entry_idx, entry in enumerate(data_list):
        # For each root key (e.g., 'experiences', 'education', 'skills')
        for root_key in ['experiences', 'education', 'skills']:
            items = entry.get(root_key, [])
            if not isinstance(items, list):
                continue

            # Get mapping rules for this root_key
            rules = rules_by_root.get(root_key, [])

            # Prepare mappings for this root_key
            source_mappings = {}  # Maps targetProperty to sourcePath (adjusted)
            fixed_values = {}     # Maps targetProperty to targetValue
            relation_name_inverse = None

            for rule in rules:
                target_property = rule.get('targetProperty')
                source_path = rule.get('sourcePath')
                target_value = rule.get('targetValue')

                if target_value is not None:
                    # Fixed value for this target_property
                    fixed_values[target_property] = target_value

                if source_path is not None and target_property is not None:
                    # Adjust source_path to be relative to the item
                    adjusted_source_path = '.'.join(source_path.split('.')[1:]) if '.' in source_path else source_path
                    source_mappings[target_property] = adjusted_source_path

                # Collect relationNameInverse if present
                if 'relationNameInverse' in rule:
                    relation_name_inverse = rule['relationNameInverse']

            # Process each item under this root_key
            for idx, item in enumerate(items):
                extracted_item = {}

                # Extract values based on source mappings
                for target_property, adjusted_source_path in source_mappings.items():
                    value = get_nested_value(item, adjusted_source_path)
                    # Handle list of strings for description fields
                    if target_property == 'description' and isinstance(value, list):
                        value = ' '.join(value)
                    extracted_item[target_property] = value

                # Apply fixed values (overwrites any values from data)
                for target_property, target_value in fixed_values.items():
                    extracted_item[target_property] = target_value

                # Classify and store the extracted item
                if 'soo:experienceType' in extracted_item:
                    experience_type = extracted_item['soo:experienceType']
                    if experience_type == 'term:experience/type/professional':
                        # It's a professional experience
                        item_key = f"experience_{entry_idx}_{idx}"
                        extracted_data['experiences'][item_key] = {
                            'prefLabel': extracted_item.get('prefLabel'),
                            'description': extracted_item.get('description'),
                            'family': extracted_item.get('family')
                        }
                    elif experience_type == 'term:experience/type/educational':
                        # It's an educational experience
                        item_key = f"formation_{entry_idx}_{idx}"
                        extracted_data['formations'][item_key] = {
                            'prefLabel': extracted_item.get('prefLabel'),
                            'description': extracted_item.get('description'),
                            'family': extracted_item.get('family')
                        }
                elif relation_name_inverse == 'soo:skill':
                    # It's a skill
                    item_key = f"skill_{entry_idx}_{idx}"
                    extracted_data['skills'][item_key] = {
                        'prefLabel': extracted_item.get('prefLabel'),
                        'description': extracted_item.get('description'),
                        'category': extracted_item.get('category')
                    }

    # Store extracted data in session state
    st.session_state['extracted_data'] = extracted_data

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
            with st.container(border=True):
                field_list = st.session_state.fieldList
                tree_root = build_tree(field_list)
                display_lines = build_display_lines(tree_root)
                
                # Use st.code to preserve formatting
                tree_text = '\n'.join(display_lines)
                st.code(tree_text, language='')

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
        if item["class"] == "Experience":
            for property,values in st.session_state[st.session_state.selectedType]:
                name,value = st.columns(2)
                name.info(property)
                item[property] = value.selectbox("type",values,label_visibility="collapsed",format_func=str.capitalize,key=f"{property}_value")
        elif item["class"] == "Skill":
                name,value = st.columns(2)
                name.info("Associated Experience")
                item["targetExp"] = value.selectbox("Associated Experience",["No associated experiences"] + [created_items["name"] for created_items in st.session_state.itemList if created_items["class"]=="Experience"],label_visibility="collapsed",format_func=str.capitalize,key=f"targetExp_value")
            
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
        if item["class"] == "Experience":
            for i,(property,_ )in enumerate(st.session_state["Experience"]):
                cols[i+3].info(item[property])
        elif item["class"] == "Skill" and item["targetExp"] != "No associated experiences":
            for i,property in enumerate([f'Linked to : {item["targetExp"]}',"None"]):
                cols[i+3].info(property)
        else:
            for i in range(2):
                cols[i+3].info("None")
            

########################## RULES CREATION & DISPLAY #####################################

def clear_all_matches():
    for key in ["inputs_position_esco","position_embeddings","formation_embeddings","skill_embeddings","inputs_position_rome","inputs_skill_esco","inputs_skill_rome","skill","data_to_match","validated_skills"]:
        try:
            st.session_state.__delitem__(key)
        except:
            pass
    
def matchingTab():
    st.header("Map your fields", divider="red")
    create_mapping_form()
    st.header("Your Rules", divider="red")
    display_existing_rules()
    if len(st.session_state.mappingList) > 1:
        if "result_jsonld" not in st.session_state:
            st.session_state.result_jsonld = None

        if st.button("Load JSON-LD", use_container_width=True):
            with st.spinner("Loading..."):
                result = send_to_api()
                if result is not None:
                    st.session_state.result_jsonld = result

        if st.session_state.result_jsonld is not None:
            st.download_button(
                "Download JSON-LD",
                data=json.dumps(st.session_state.result_jsonld),
                file_name="data.jsonld",
                mime="application/ld+json",
                use_container_width=True
            )

def auto_assign_generateID():
    """
    Assign 'generateID' to the first field of each object class 
    that is missing a 'generateID' flag.
    """
    obj_names = {}
    for field in st.session_state.fieldList:
        object_info = st.session_state.get(f"object_{field}", {})
        if object_info.get("name") != "No Mapping":
            obj_name = object_info['name']
            if obj_name not in obj_names:
                obj_names[obj_name] = field  # Keep track of the first occurrence
    for obj_name, field in obj_names.items():
        generateID = st.session_state.get(f"generateID_{field}", False)
        if not generateID:  # Assign if no 'generateID' was checked
            st.session_state[f"generateID_{field}"] = True


def create_mapping_form():
    # Before creating widgets or rules:
    if st.session_state.get('auto_assign_needed', False):
        auto_assign_generateID()
        st.session_state['auto_assign_needed'] = False

    if st.session_state.get('create_rules_next', False):
        st.session_state.mappingList = []
        for field in st.session_state.fieldList:
            if st.session_state.get(f"object_{field}", {}).get("name") != "No Mapping":
                create_rule(field)
        st.session_state['create_rules_next'] = False
        clear_all_matches()
        st.rerun()

        
    cols = st.columns(3)
    names = ["Field", "Object", "Property"]
    for i in range(3):
        cols[i].subheader(names[i], divider="red")

    for field in st.session_state.fieldList:
        createMatchingForm(field)

    if 'confirm_overwrite' not in st.session_state:
        st.session_state['confirm_overwrite'] = False

    if st.button("Create Rules", use_container_width=True, key="create_rules_button"):
        st.session_state['confirm_overwrite'] = True
        st.rerun()

    if st.session_state['confirm_overwrite']:
        # Check if we have existing rules
        existing_rules = len(st.session_state.get('ruleFile', [])) > 0
        # Check for missing IDs
        missing_generateID = check_generateID_requirements()

        # If there are existing rules, warn about overwrite
        if existing_rules:
            st.warning("This will overwrite existing rules. Do you want to proceed?")
        
        # If IDs are missing, warn that IDs will be generated automatically
        if missing_generateID:
            st.warning(f"No ID selected for objects: {', '.join(missing_generateID)}. IDs will be generated automatically.")

        # If either condition applies, show proceed/cancel
        if existing_rules or missing_generateID:
            _, col1, _, col2, _ = st.columns(5)
            proceed = col1.button("Yes, proceed", key="confirm_overwrite_yes", use_container_width=True)
            cancel = col2.button("Cancel", key="confirm_overwrite_no", use_container_width=True)

            if proceed:
                if missing_generateID:
                    st.session_state['auto_assign_needed'] = True
                st.session_state['create_rules_next'] = True
                st.session_state['confirm_overwrite'] = False
                st.rerun()

            elif cancel:
                st.session_state['confirm_overwrite'] = False
                st.rerun()
        else:
            # No existing rules and no missing IDs
            # Directly create new rules without confirmation
            st.session_state.mappingList = []
            for field in st.session_state.fieldList:
                if st.session_state.get(f"object_{field}", {}).get("name") != "No Mapping":
                    create_rule(field)
            st.session_state['confirm_overwrite'] = False
            clear_all_matches()
            st.rerun()


def check_generateID_requirements():
    obj_namees = {}
    for field in st.session_state.fieldList:
        object_info = st.session_state.get(f"object_{field}", {})
        if object_info.get("name") != "No Mapping":
            obj_name = object_info['name']
            generateID = st.session_state.get(f"generateID_{field}", False)
            if obj_name not in obj_namees:
                obj_namees[obj_name] = {'generateID_checked': False}
            if generateID:
                obj_namees[obj_name]['generateID_checked'] = True
    missing_generateID = [obj_class for obj_class, info in obj_namees.items() if not info['generateID_checked']]
    return missing_generateID


def create_rule(field):
    if st.session_state[f"generateID_{field}"] and st.session_state[f'object_{field}']['class'] == 'Experience':
            id_rule = {"id": f"mmr:rule-{len(st.session_state.mappingList)}",
                    "sourcePath": field,
                    "targetClass": st.session_state[f'object_{field}']['name'],
                    "generateId": "true"}
                    
            st.session_state.mappingList.append(id_rule)
            
            type_rule = {
                            "id": f"mmr:rule-{len(st.session_state.mappingList)}",
                            "sourcePath": field,
                            "targetClass": st.session_state[f'object_{field}']['name'],
                            "targetProperty": "soo:experienceType",
                            "targetValue": f"term:experience/type/{st.session_state[f'object_{field}']['type'].replace(' ','')}"
                        }
                    
            st.session_state.mappingList.append(type_rule)
            
            status_rule =  {
                        "id": f"mmr:rule-{len(st.session_state.mappingList)}",
                        "sourcePath": field,
                        "targetClass": st.session_state[f'object_{field}']['name'],
                        "targetProperty": "soo:experienceStatus",
                        "targetValue": f"term:experience/type/{st.session_state[f'object_{field}']['status']}"
                    }
                    
            st.session_state.mappingList.append(status_rule)
    if st.session_state[f"generateID_{field}"] and st.session_state[f'object_{field}']['class'] == 'Skill':

        id_rule ={"id": f"mmr:rule-{len(st.session_state.mappingList)}", 
                "sourcePath": field,
                "targetClass": st.session_state[f'object_{field}']['name'],
                "generateId" : "true",
                "relationTo" : "soo:Experience",
                "relationName" : "Experience",
                "relationNameInverse" : "soo:skill"}
        
        if st.session_state[f'object_{field}']["targetExp"] != "No associated experiences":
            id_rule["relationName"] = st.session_state[f'object_{field}']["targetExp"]
            
        st.session_state.mappingList.append(id_rule)
        
        
    rule = {"id": f"mmr:rule-{len(st.session_state.mappingList)}",
            "sourcePath": field,
            "targetClass": st.session_state[f'object_{field}']['name'],
            "targetProperty": st.session_state[f'property4{field}']}
    
    if st.session_state[f"generateID_{field}"] and st.session_state[f'object_{field}']['class'] == 'Profile':
        rule["generateId"] = "true"

        rule["relationTo"] = "soo:Experience"
        rule["relationName"] = "soo:containsExperience"
        rule["relationNameInverse"] =  "soo:hasProfile"
    
  
        
    if st.session_state[f'property4{field}'] == "soo:result":
        rule['targetFunction'] = "fno:skill-value-to-scale"
        
    if st.session_state[f'property4{field}'] == "skos:prefLabel":
        rule['targetFunction'] = rule['targetFunction'] = "fno:asIs_WithLang"
        rule[ "targetLang"] = st.session_state[f"object_{field}"]["language"]
    
    if st.session_state[f'property4{field}'] == "soo:date":
        rule['targetFunction'] = "fno:date-to-xsd"
        
    st.session_state.mappingList.append(rule)
    st.session_state.mapped.append(field)

def createMatchingForm(field):
    f, o, p, t = st.columns([5, 5, 5, 1])
    f.info(field)
    default_object = st.session_state.get(f"object_{field}", {"name": "No Mapping"})
    o.selectbox(
        "object",
        [{"name": "No Mapping"}] + st.session_state.itemList,
        format_func=lambda x: x["name"],
        key=f"object_{field}",
        index=[i for i, obj in enumerate([{"name": "No Mapping"}] + st.session_state.itemList) if obj["name"] == default_object["name"]][0],
        label_visibility="collapsed"
    )
    if st.session_state[f"object_{field}"]["name"] != "No Mapping":
        properties = st.session_state.soo_data_model[st.session_state[f"object_{field}"]["class"]]
        p.selectbox("Property", properties, key=f"property4{field}", label_visibility="collapsed")
    else:
        p.selectbox("Property", [], key=f"property4{field}", label_visibility="collapsed")
    t.checkbox("ID", key=f"generateID_{field}")

def display_existing_rules():
    st.session_state.ruleFile = {
        "@context": {
            "todo": "define_the_rules_context"
        },
        "graph": st.session_state.mappingList
    }
    st.code(json.dumps(st.session_state.ruleFile, indent=4))

 
########################## API INTEGRATION #####################################

def send_to_api():
    # Construct the payload
    payload = {
        "mapping_rules": st.session_state.ruleFile,
        "document": st.session_state.data
    }
    url = "https://ontobridge-api-dev-934098617065.europe-west1.run.app/ontologies/get_jsonld_from_mapping_rules"

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            result = response.json()
            st.success("API call successful.")
            return(result)
        else:
            st.error(f"API call failed with status code {response.status_code}")
            st.error(response.text)
    except Exception as e:
        st.error(f"An error occurred: {e}")

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
