import sys

from flask import render_template, jsonify
from flask_cors import CORS

sys.path.append(['ui'])

from automation.website.app import app
from automation.core.ui.db import query_handler as qhandler
from automation.website.app.views.base_views import BaseView
from automation.website.app.core import utils
CORS(app)


class UI(BaseView):
    def __init__(self):
        self.qhandler = qhandler
        super().__init__()
        self.res = {}

    def get_apps_env(self):
        env_list = []
        env_list = self.qhandler.website_select_environments()
        # pve_env, pve_dsn = envs[0]
        #
        # for env, dsn in envs:
        #     name = self.merge_env_db_name(env, dsn)
        #     env_list.append({'pve_env': env, 'pve_dsn': dsn, 'name': name})

        # self.res['title_txt'] = 'ui'
        # self.res['envs'] = env_list
        # self.res['selected_env'] = ''
        #
        # tests = self.construct_tests(pve_env, pve_dsn)
        # stats = self._get_stats(tests)

        # return render_template('ui.html', title=self.res['title_txt'], tests=tests, stats=stats, res=self.res)
        return env_list

    def construct_stats(self, pve_env, pve_dsn):
        tests = self.construct_tests(pve_env, pve_dsn)
        stats = self._get_stats(tests)
        return jsonify(stats)

    def construct_tests(self, pve_env, pve_dsn):
        tests = []
        final_dct, asc_lst = self.construct_ui_final_dict(pve_env, pve_dsn)
        list(map((lambda test_id: tests.append(final_dct[test_id])), asc_lst))
        return tests

    def construct_ui_final_dict(self, *args):
        asc_lst = []
        temp_dict = {}
        ui_final_dct ={}
        results = self.qhandler.website_get_test_results(*args)
        for index, value in enumerate(results):
            result = results[index]
            status = {'uuid': result['uuid'], 'passed': result['result'],
                      'last_run': utils.sql_to_html_time(str(result['last_run']), only_date=True),
                      'latest': False}
            zid = value['zid']
            if zid not in ui_final_dct:
                asc_lst.append(zid)
                temp_dict = {zid: {'url': 'http://jira/browse/'+zid,
                                        'descr': ('Description' + zid),
                                        'last_run': utils.sql_to_html_time(str(result['last_run'])),
                                        'timestamp': utils.sql_to_timestamp(str(result['last_run']))
                                   }}
                ui_final_dct.update(temp_dict)
                ui_final_dct[zid].update(result)

                status['latest'] = True
                ui_final_dct[zid]['status'] = [status]
                ui_final_dct[zid]['env_name'] = self.merge_env_db_name(result['pve_env'], result['pve_dsn'])

                ui_final_dct = self.is_some_failed(result['result'], ui_final_dct, zid)
                ui_final_dct[zid].pop('uuid')
            else:
                ui_final_dct[zid]['status'].append(status)
        return ui_final_dct, asc_lst

    def _construct_ui_details(self, uuid):
        result = self.qhandler.website_select_test_result_by_uuid(uuid)[0]

        step_details = self.qhandler.website_select_test_step_details(uuid)
        zid = result['zid']
        screenshot_path = utils.get_screenshot_path(step_details)
        dct_steps = {'zid': zid, 'passed': result['result'],
                     'date': utils.sql_to_html_time(str(result['last_run'])),
                     'screenshot_path': screenshot_path,
                     'timestamp': utils.sql_to_timestamp(str(result['last_run'])),
                     'steps': step_details, 'num_steps': len(step_details),
                     'descr': 'Test case description ' + zid, 'uuid': uuid, 'ui': True}

        return dct_steps

    def get_db(self, pve_env):
        db_list = self.qhandler.website_select_database(pve_env)
        return db_list


UI_OBJ = UI()


@app.route('/ui')
def select_ui():
    return jsonify(UI_OBJ.get_apps_env())


@app.route('/ui/<pve_env>')
def get_db_list(pve_env):
    return jsonify(UI_OBJ.get_db(pve_env))


@app.route('/ui/tests/<pve_env>/<pve_dsn>')
def show_tests_in_results_table(pve_env, pve_dsn):
    return jsonify(UI_OBJ.construct_tests(pve_env, pve_dsn))


@app.route('/ui/stats/<pve_env>/<pve_dsn>')
def show_stats(pve_env, pve_dsn):
    return UI_OBJ.construct_stats(pve_env, pve_dsn)


@app.route('/ui/<pve_env>/<pve_dsn>')
def ui_test_type_results(pve_env, pve_dsn):
    tests = UI_OBJ.construct_tests(pve_env, pve_dsn)
    stats = UI_OBJ.construct_stats(tests)
    return render_template('ui.html', title=UI_OBJ.res['title_txt'], tests=tests, stats=stats, res=UI_OBJ.res)


@app.route('/ui/test/<uuid>')
def ui_test_result(uuid):
    details = UI_OBJ._construct_ui_details(uuid)
    return jsonify(**details)



