
def graph_content_check(expectedLd, generatedLd, extract_concept: bool = True):
    print('\n === Start testing Graph content between expected & generated ===')
    ## 1/ create working copies of the lists
    e_list = expectedLd["graph"][:]
    g_list = generatedLd['graph'][:]
    
    ## 2/ remove dynamic skos:Concepts from the lists  
    if extract_concept :    
        e_list_concept = extract_skos_concept(e_list)
        g_list_concept = extract_skos_concept(g_list)
        print(len(e_list_concept), ' | ', len(g_list_concept), 'Concepts in source | result')
    else: 
        print('### Do not extract concepts from the EXPECTED & the GENERATED')

    e_list_skill = extract_esco_skill(e_list)
    g_list_skill = extract_esco_skill(g_list)
    print(len(e_list_skill), ' | ', len(g_list_skill), 'ESCO-Skills in source | result')

    e_list_suggestion = extract_mms_suggestion(e_list)
    g_list_suggestion = extract_mms_suggestion(g_list)
    print(len(e_list_suggestion), ' | ', len(g_list_suggestion), 'Suggestions in source | result')

    # print(s_list_suggestion)

    skip_prop_content_check = ['mapping', 'suggestions']
    
    for e in e_list: 
        print('=== Search a generated entity for the expected entity with id : ', e['id'])
        generated = extract_generated_entity(e, g_list=g_list)
        # check that the generated entity exist
        if not len(generated) == 1 : 
            print(f'The entity with id "{e['id']}" was not found in the GENERATED file. The EXPECTED entity is', e)
        assert len(generated) == 1
        gen = generated[0]
        # check details of the generated entity 
        # a) compare the keys
        e_keys = list(e.keys())
        g_keys = list(gen.keys())
        e_keys_diff = [s for s in e_keys if s not in g_keys] # keys only in the Expected object
        g_keys_diff = [s for s in g_keys if s not in e_keys] # keys only in the Generated object

        if len(e_keys_diff) != 0 : 
            print('--> For id=', e['id'],'There is an additionnal property in the EXPECTED file:', e_keys_diff)
        assert len(e_keys_diff) == 0
        if len(g_keys_diff) != 0 :
            print('--> For id=', gen['id'],'There is an additionnal property in the GENERATED file:', g_keys_diff)
        assert len(g_keys_diff) == 0
        
        # b) compare the values
        for k in e_keys: 
            if k in skip_prop_content_check : 
                print('--> skip content check of property', k)
            else: 
                if not e[k] == gen[k] : 
                    print(f'--> for this property "{k}" the contents are differents. \nExpected:\n', e, '\n\nGenerated:\n', gen)
                assert e[k] == gen[k]


def extract_generated_entity(e_entity, g_list):
    extracted = []
    for (i, g_entity) in enumerate(g_list) :
        if 'id' not in e_entity : 
            print('--> Expected : There is no "id" for this object:', e_entity)
            continue
        if 'id' not in g_entity : 
            print('--> Generated : There is no "id" for this object:', g_entity)
            continue


        if e_entity['id'] == g_entity['id']: 
            extracted.append(g_entity)
            del g_list[i]
    return extracted

def extract_by_type(graph, typeName):
    indicesToRemove = []
    for (i, e) in enumerate(graph): 
        if 'type' in e: 
            type_val = e['type'] 
            if not isinstance(type_val, list) : type_val = [type_val]
            if typeName in type_val:
                indicesToRemove.append(i)
                
    extracted = []
    ## reverse to remove last indice first 
    for i in reversed(indicesToRemove):
        extracted.append(graph.pop(i))

    return list(reversed(extracted))

def extract_skos_concept(graph):
    return extract_by_type(graph, 'skos:Concept')
    
def extract_esco_skill(graph):
    return extract_by_type(graph, 'esco:Skill')

def extract_mms_suggestion(graph):
    return extract_by_type(graph, 'mms:Suggestion')
