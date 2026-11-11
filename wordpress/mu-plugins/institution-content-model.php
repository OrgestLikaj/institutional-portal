<?php
/**
 * Plugin Name: Institution Content Model (headless)
 * Description: Custom post types, taxonomies, ACF fields and REST endpoints consumed by the Next.js frontend.
 * Version:     1.0.0
 *
 * Install: copy to wp-content/mu-plugins/. Requires Advanced Custom Fields (PRO for repeaters / options page).
 * Multilingual: works with Polylang (REST ?lang=sq|en) or WPML (?wpml_language=).
 * See docs/WORDPRESS.md in the frontend repository for the full content model.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ─────────────────────────────────────────────────────────────
 * 1. Custom post types
 * ───────────────────────────────────────────────────────────── */
add_action('init', function () {
    $types = [
        // slug                 rest_base                  singular (sq)          plural (sq)              icon                    supports
        ['inst_news',          'news',                    'Lajm',                'Lajme',                 'dashicons-megaphone',  ['title', 'editor', 'excerpt', 'thumbnail', 'revisions']],
        ['inst_announcement',  'announcements',           'Njoftim',             'Njoftime',              'dashicons-bell',       ['title', 'editor', 'excerpt', 'revisions']],
        ['inst_publication',   'publications',            'Publikim',            'Publikime',             'dashicons-book',       ['title', 'excerpt', 'revisions']],
        ['inst_legal',         'legal-documents',         'Akt ligjor',          'Kuadri ligjor',         'dashicons-media-text', ['title', 'excerpt', 'revisions']],
        ['inst_transparency',  'transparency-documents',  'Dokument transparence', 'Transparenca',        'dashicons-visibility', ['title', 'excerpt', 'revisions']],
        ['inst_report',        'reports',                 'Raport',              'Raporte',               'dashicons-chart-bar',  ['title', 'excerpt', 'revisions']],
        ['inst_vacancy',       'vacancies',               'Vend vakant',         'Karriera',              'dashicons-id',         ['title', 'excerpt', 'revisions']],
        ['inst_leader',        'leaders',                 'Drejtues',            'Drejtuesit',            'dashicons-businessperson', ['title', 'editor', 'thumbnail', 'page-attributes']],
        ['inst_department',    'departments',             'Njësi',               'Struktura',             'dashicons-networking', ['title', 'excerpt', 'page-attributes']],
    ];

    foreach ($types as [$slug, $rest, $singular, $plural, $icon, $supports]) {
        register_post_type($slug, [
            'label'         => $plural,
            'labels'        => ['name' => $plural, 'singular_name' => $singular, 'add_new_item' => "Shto $singular", 'edit_item' => "Ndrysho $singular"],
            'public'        => true,
            'show_in_rest'  => true,
            'rest_base'     => $rest,
            'menu_icon'     => $icon,
            'supports'      => $supports,
            'has_archive'   => false,
            'rewrite'       => ['slug' => $rest],
            'hierarchical'  => in_array('page-attributes', $supports, true),
        ]);
    }

    /* ── Taxonomies ── */
    $taxonomies = [
        ['news_category',       ['inst_news'],                                        'Kategoritë e lajmeve'],
        ['document_category',   ['inst_legal', 'inst_transparency', 'inst_report'],   'Kategoritë e dokumenteve'],
        ['publication_type',    ['inst_publication'],                                 'Llojet e publikimeve'],
        ['department_category', ['inst_department', 'inst_vacancy'],                  'Kategoritë e njësive'],
    ];
    foreach ($taxonomies as [$tax, $objects, $label]) {
        register_taxonomy($tax, $objects, [
            'label'             => $label,
            'hierarchical'      => true,
            'show_in_rest'      => true,
            'show_admin_column' => true,
        ]);
    }

    register_nav_menus(['primary' => 'Navigimi kryesor', 'footer' => 'Lidhjet e fundit të faqes']);
});

/* Filter announcements by ACF "announcement_type" (?announcement_type=press) */
add_filter('rest_inst_announcement_query', function ($args, $request) {
    $type = sanitize_key($request->get_param('announcement_type'));
    if ($type) {
        $args['meta_query'] = [['key' => 'announcement_type', 'value' => $type]];
    }
    return $args;
}, 10, 2);

/* ─────────────────────────────────────────────────────────────
 * 2. ACF field groups (all exposed in REST under "acf")
 * ───────────────────────────────────────────────────────────── */
add_action('acf/init', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    $attachments = [
        'key' => 'field_attachments', 'name' => 'attachments', 'label' => 'Dokumente bashkëngjitur', 'type' => 'repeater',
        'button_label' => 'Shto dokument',
        'sub_fields' => [
            ['key' => 'field_att_title', 'name' => 'title', 'label' => 'Titulli', 'type' => 'text'],
            ['key' => 'field_att_file', 'name' => 'file', 'label' => 'Skedari', 'type' => 'file', 'return_format' => 'array', 'mime_types' => 'pdf,doc,docx,xls,xlsx'],
        ],
    ];
    $loc = fn($type) => [[['param' => 'post_type', 'operator' => '==', 'value' => $type]]];

    acf_add_local_field_group([
        'key' => 'group_news', 'title' => 'Të dhënat e lajmit', 'show_in_rest' => 1, 'location' => $loc('inst_news'),
        'fields' => [
            ['key' => 'field_news_subtitle', 'name' => 'subtitle', 'label' => 'Nëntitulli', 'type' => 'textarea', 'rows' => 2],
            ['key' => 'field_news_author', 'name' => 'author_department', 'label' => 'Autori / Njësia', 'type' => 'text'],
            ['key' => 'field_news_featured', 'name' => 'is_featured', 'label' => 'Në fokus', 'type' => 'true_false', 'ui' => 1],
            $attachments,
        ],
    ]);

    acf_add_local_field_group([
        'key' => 'group_announcement', 'title' => 'Të dhënat e njoftimit', 'show_in_rest' => 1, 'location' => $loc('inst_announcement'),
        'fields' => [
            ['key' => 'field_ann_type', 'name' => 'announcement_type', 'label' => 'Lloji', 'type' => 'select', 'required' => 1,
             'choices' => ['official' => 'Njoftim zyrtar', 'notice' => 'Njoftim publik', 'press' => 'Njoftim për shtyp', 'update' => 'Përditësim institucional']],
            ['key' => 'field_ann_important', 'name' => 'is_important', 'label' => 'E rëndësishme', 'type' => 'true_false', 'ui' => 1],
            $attachments,
        ],
    ]);

    acf_add_local_field_group([
        'key' => 'group_document', 'title' => 'Të dhënat e dokumentit', 'show_in_rest' => 1,
        'location' => [$loc('inst_publication')[0], $loc('inst_legal')[0], $loc('inst_transparency')[0], $loc('inst_report')[0]],
        'fields' => [
            ['key' => 'field_doc_description', 'name' => 'description', 'label' => 'Përshkrimi', 'type' => 'textarea', 'rows' => 3],
            ['key' => 'field_doc_date', 'name' => 'document_date', 'label' => 'Data e dokumentit', 'type' => 'date_picker', 'return_format' => 'Y-m-d'],
            ['key' => 'field_doc_ref', 'name' => 'reference_number', 'label' => 'Numri i referencës', 'type' => 'text'],
            ['key' => 'field_doc_file', 'name' => 'file', 'label' => 'Skedari', 'type' => 'file', 'required' => 1, 'return_format' => 'array'],
        ],
    ]);

    acf_add_local_field_group([
        'key' => 'group_vacancy', 'title' => 'Të dhënat e vendit vakant', 'show_in_rest' => 1, 'location' => $loc('inst_vacancy'),
        'fields' => [
            ['key' => 'field_vac_dept', 'name' => 'department', 'label' => 'Njësia', 'type' => 'text', 'required' => 1],
            ['key' => 'field_vac_location', 'name' => 'location', 'label' => 'Vendi i punës', 'type' => 'text', 'default_value' => 'Tiranë'],
            ['key' => 'field_vac_contract', 'name' => 'contract_type', 'label' => 'Lloji i kontratës', 'type' => 'text'],
            ['key' => 'field_vac_deadline', 'name' => 'deadline', 'label' => 'Afati i aplikimit', 'type' => 'date_picker', 'return_format' => 'Y-m-d', 'required' => 1],
            ['key' => 'field_vac_status', 'name' => 'status', 'label' => 'Statusi', 'type' => 'select', 'choices' => ['open' => 'E hapur', 'closed' => 'E mbyllur'], 'default_value' => 'open'],
            ['key' => 'field_vac_resp', 'name' => 'responsibilities', 'label' => 'Detyrat kryesore (një për rresht)', 'type' => 'textarea'],
            ['key' => 'field_vac_req', 'name' => 'requirements', 'label' => 'Kërkesat e posaçme (një për rresht)', 'type' => 'textarea'],
            array_merge($attachments, ['key' => 'field_vac_docs', 'name' => 'application_documents', 'label' => 'Dokumente për aplikim']),
        ],
    ]);

    acf_add_local_field_group([
        'key' => 'group_leader', 'title' => 'Të dhënat e drejtuesit', 'show_in_rest' => 1, 'location' => $loc('inst_leader'),
        'fields' => [
            ['key' => 'field_leader_role', 'name' => 'role', 'label' => 'Funksioni', 'type' => 'text', 'required' => 1],
            ['key' => 'field_leader_term', 'name' => 'term', 'label' => 'Mandati / statusi', 'type' => 'text'],
        ],
    ]);

    acf_add_local_field_group([
        'key' => 'group_department', 'title' => 'Të dhënat e njësisë', 'show_in_rest' => 1, 'location' => $loc('inst_department'),
        'fields' => [
            ['key' => 'field_dept_key', 'name' => 'key', 'label' => 'Kodi i njësisë (unik, p.sh. "legal")', 'type' => 'text', 'required' => 1],
            ['key' => 'field_dept_parent', 'name' => 'parent_key', 'label' => 'Kodi i njësisë mëmë', 'type' => 'text'],
            ['key' => 'field_dept_level', 'name' => 'level', 'label' => 'Niveli në organigramë', 'type' => 'select', 'choices' => ['0' => 'Drejtuesi', '1' => 'Mbështetje e drejtimit', '2' => 'Drejtori']],
            ['key' => 'field_dept_resp', 'name' => 'responsibilities', 'label' => 'Përgjegjësitë (një për rresht)', 'type' => 'textarea'],
            ['key' => 'field_dept_units', 'name' => 'units', 'label' => 'Sektorët (një për rresht)', 'type' => 'textarea'],
        ],
    ]);

    acf_add_local_field_group([
        'key' => 'group_about', 'title' => 'Profili institucional', 'show_in_rest' => 1,
        'location' => [[['param' => 'page_template', 'operator' => '==', 'value' => 'default'], ['param' => 'page', 'operator' => '!=', 'value' => '0']]],
        'fields' => [
            ['key' => 'field_about_intro', 'name' => 'introduction', 'label' => 'Prezantimi (një paragraf për rresht)', 'type' => 'textarea'],
            ['key' => 'field_about_mission', 'name' => 'mission', 'label' => 'Misioni', 'type' => 'textarea'],
            ['key' => 'field_about_vision', 'name' => 'vision', 'label' => 'Vizioni', 'type' => 'textarea'],
            ['key' => 'field_about_values', 'name' => 'values', 'label' => 'Vlerat', 'type' => 'repeater', 'sub_fields' => [
                ['key' => 'field_val_title', 'name' => 'title', 'label' => 'Vlera', 'type' => 'text'],
                ['key' => 'field_val_text', 'name' => 'text', 'label' => 'Përshkrimi', 'type' => 'textarea', 'rows' => 2],
            ]],
            ['key' => 'field_about_mandate', 'name' => 'mandate', 'label' => 'Mandati ligjor', 'type' => 'wysiwyg'],
            ['key' => 'field_about_basis', 'name' => 'legal_basis', 'label' => 'Baza ligjore', 'type' => 'repeater', 'sub_fields' => [
                ['key' => 'field_basis_title', 'name' => 'title', 'label' => 'Akti', 'type' => 'text'],
                ['key' => 'field_basis_ref', 'name' => 'reference', 'label' => 'Referenca', 'type' => 'text'],
            ]],
            ['key' => 'field_about_history', 'name' => 'history', 'label' => 'Historiku', 'type' => 'repeater', 'sub_fields' => [
                ['key' => 'field_hist_year', 'name' => 'year', 'label' => 'Viti', 'type' => 'text'],
                ['key' => 'field_hist_title', 'name' => 'title', 'label' => 'Titulli', 'type' => 'text'],
                ['key' => 'field_hist_text', 'name' => 'text', 'label' => 'Përshkrimi', 'type' => 'textarea', 'rows' => 2],
            ]],
            ['key' => 'field_about_principles', 'name' => 'principles', 'label' => 'Parimet', 'type' => 'repeater', 'sub_fields' => [
                ['key' => 'field_pr_title', 'name' => 'title', 'label' => 'Parimi', 'type' => 'text'],
                ['key' => 'field_pr_text', 'name' => 'text', 'label' => 'Përshkrimi', 'type' => 'textarea', 'rows' => 2],
            ]],
        ],
    ]);

    /* ── Site settings (options page) ── */
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page(['page_title' => 'Cilësimet e faqes', 'menu_slug' => 'inst-settings', 'icon_url' => 'dashicons-admin-site-alt3']);
    }
    acf_add_local_field_group([
        'key' => 'group_settings', 'title' => 'Identiteti dhe kontaktet', 'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'inst-settings']]],
        'fields' => [
            ['key' => 'field_set_name', 'name' => 'name', 'label' => 'Emri i institucionit', 'type' => 'text'],
            ['key' => 'field_set_short', 'name' => 'short_name', 'label' => 'Emri i shkurtër', 'type' => 'text'],
            ['key' => 'field_set_tagline', 'name' => 'tagline', 'label' => 'Nëntitulli', 'type' => 'text'],
            ['key' => 'field_set_desc', 'name' => 'description', 'label' => 'Përshkrimi', 'type' => 'textarea'],
            ['key' => 'field_set_logo', 'name' => 'logo', 'label' => 'Logo (SVG/PNG)', 'type' => 'image', 'return_format' => 'url'],
            ['key' => 'field_set_street', 'name' => 'street', 'label' => 'Adresa', 'type' => 'text'],
            ['key' => 'field_set_city', 'name' => 'city', 'label' => 'Qyteti', 'type' => 'text'],
            ['key' => 'field_set_map', 'name' => 'map_url', 'label' => 'Lidhja e hartës', 'type' => 'url'],
            ['key' => 'field_set_email', 'name' => 'email', 'label' => 'Email', 'type' => 'email'],
            ['key' => 'field_set_rti', 'name' => 'rti_email', 'label' => 'Email i koordinatorit për informim', 'type' => 'email'],
            ['key' => 'field_set_press', 'name' => 'press_email', 'label' => 'Email për median', 'type' => 'email'],
            ['key' => 'field_set_phone', 'name' => 'phone', 'label' => 'Telefoni', 'type' => 'text'],
            ['key' => 'field_set_hours', 'name' => 'office_hours', 'label' => 'Orari i pritjes', 'type' => 'text'],
            ['key' => 'field_set_social', 'name' => 'social', 'label' => 'Rrjetet sociale', 'type' => 'repeater', 'sub_fields' => [
                ['key' => 'field_soc_id', 'name' => 'id', 'label' => 'Rrjeti', 'type' => 'select', 'choices' => ['facebook' => 'Facebook', 'x' => 'X', 'linkedin' => 'LinkedIn', 'youtube' => 'YouTube']],
                ['key' => 'field_soc_url', 'name' => 'url', 'label' => 'URL', 'type' => 'url'],
            ]],
            ['key' => 'field_set_partners', 'name' => 'partners', 'label' => 'Institucione partnere', 'type' => 'repeater', 'sub_fields' => [
                ['key' => 'field_par_label', 'name' => 'label', 'label' => 'Emri', 'type' => 'text'],
                ['key' => 'field_par_url', 'name' => 'url', 'label' => 'URL', 'type' => 'url'],
            ]],
            ['key' => 'field_set_forms', 'name' => 'application_forms', 'label' => 'Formularë aplikimi (Karriera)', 'type' => 'repeater', 'sub_fields' => [
                ['key' => 'field_form_title', 'name' => 'title', 'label' => 'Titulli', 'type' => 'text'],
                ['key' => 'field_form_file', 'name' => 'file', 'label' => 'Skedari', 'type' => 'file', 'return_format' => 'array'],
            ]],
            ['key' => 'field_set_stats_demo', 'name' => 'stats_demo', 'label' => 'Statistikat janë demonstruese', 'type' => 'true_false', 'ui' => 1, 'default_value' => 1],
            ['key' => 'field_set_stats', 'name' => 'stats', 'label' => 'Statistikat e faqes kryesore', 'type' => 'repeater', 'max' => 4, 'sub_fields' => [
                ['key' => 'field_stat_value', 'name' => 'value', 'label' => 'Vlera', 'type' => 'number'],
                ['key' => 'field_stat_suffix', 'name' => 'suffix', 'label' => 'Prapashtesa (p.sh. %)', 'type' => 'text'],
                ['key' => 'field_stat_label', 'name' => 'label', 'label' => 'Etiketa', 'type' => 'text'],
                ['key' => 'field_stat_period', 'name' => 'period', 'label' => 'Periudha', 'type' => 'text'],
            ]],
            ['key' => 'field_set_hero', 'name' => 'hero_image', 'label' => 'Imazhi kryesor', 'type' => 'image', 'return_format' => 'array'],
        ],
    ]);
});

/* ─────────────────────────────────────────────────────────────
 * 3. Custom REST endpoints  (/wp-json/inst/v1/…)
 * ───────────────────────────────────────────────────────────── */
function inst_option($name)
{
    return function_exists('get_field') ? get_field($name, 'option') : null;
}

add_action('rest_api_init', function () {
    $public = '__return_true';

    register_rest_route('inst/v1', '/settings', ['methods' => 'GET', 'permission_callback' => $public, 'callback' => function () {
        $social = array_values(array_filter((array) inst_option('social'), fn($s) => !empty($s['url'])));
        return [
            'name'              => inst_option('name'),
            'shortName'         => inst_option('short_name'),
            'tagline'           => inst_option('tagline'),
            'description'       => inst_option('description'),
            'logo'              => inst_option('logo') ?: null,
            'address'           => inst_option('street') ? ['street' => inst_option('street'), 'city' => inst_option('city'), 'mapUrl' => inst_option('map_url')] : null,
            'email'             => inst_option('email'),
            'rtiEmail'          => inst_option('rti_email'),
            'pressEmail'        => inst_option('press_email'),
            'phone'             => inst_option('phone'),
            'officeHours'       => inst_option('office_hours'),
            'social'            => $social ?: null,
            'partners'          => inst_option('partners') ?: null,
            'application_forms' => inst_option('application_forms') ?: [],
        ];
    }]);

    register_rest_route('inst/v1', '/homepage', ['methods' => 'GET', 'permission_callback' => $public, 'callback' => function () {
        $hero = inst_option('hero_image');
        return [
            'hero_image' => $hero ? ['src' => $hero['url'], 'alt' => $hero['alt'], 'width' => $hero['width'], 'height' => $hero['height']] : null,
            'stats'      => ['demo' => (bool) inst_option('stats_demo'), 'items' => array_map(fn($s) => [
                'value' => (int) $s['value'], 'suffix' => $s['suffix'] ?: null, 'label' => $s['label'], 'period' => $s['period'],
            ], (array) inst_option('stats'))],
        ];
    }]);

    register_rest_route('inst/v1', '/menu/(?P<location>[a-z_-]+)', ['methods' => 'GET', 'permission_callback' => $public, 'callback' => function ($req) {
        $locations = get_nav_menu_locations();
        $menu_id = $locations[$req['location']] ?? 0;
        if (!$menu_id) {
            return [];
        }
        $items = wp_get_nav_menu_items($menu_id) ?: [];
        $tree = [];
        foreach ($items as $item) {
            if (!$item->menu_item_parent) {
                $tree[$item->ID] = ['label' => $item->title, 'href' => wp_make_link_relative($item->url), 'intro' => $item->description ?: null, 'children' => []];
            }
        }
        foreach ($items as $item) {
            if ($item->menu_item_parent && isset($tree[$item->menu_item_parent])) {
                $tree[$item->menu_item_parent]['children'][] = ['label' => $item->title, 'href' => wp_make_link_relative($item->url)];
            }
        }
        return array_values($tree);
    }]);

    register_rest_route('inst/v1', '/years/(?P<base>[a-z-]+)', ['methods' => 'GET', 'permission_callback' => $public, 'callback' => function ($req) {
        $map = ['legal-documents' => 'inst_legal', 'transparency-documents' => 'inst_transparency', 'reports' => 'inst_report', 'publications' => 'inst_publication'];
        $type = $map[$req['base']] ?? null;
        if (!$type) {
            return [];
        }
        global $wpdb;
        $years = $wpdb->get_col($wpdb->prepare(
            "SELECT DISTINCT LEFT(m.meta_value, 4) FROM {$wpdb->postmeta} m JOIN {$wpdb->posts} p ON p.ID = m.post_id
             WHERE p.post_type = %s AND p.post_status = 'publish' AND m.meta_key = 'document_date' ORDER BY 1 DESC",
            $type
        ));
        return array_values(array_filter($years));
    }]);
});

/* ─────────────────────────────────────────────────────────────
 * 4. On-demand revalidation of the Next.js frontend
 *    Define in wp-config.php:
 *      define('INST_FRONTEND_URL', 'https://www.example.al');
 *      define('INST_REVALIDATE_SECRET', '…same value as REVALIDATE_SECRET…');
 * ───────────────────────────────────────────────────────────── */
add_action('save_post', function ($post_id, $post) {
    if (wp_is_post_revision($post_id) || !defined('INST_FRONTEND_URL') || !defined('INST_REVALIDATE_SECRET')) {
        return;
    }
    $obj = get_post_type_object($post->post_type);
    $tag = $obj && !empty($obj->rest_base) ? $obj->rest_base : 'wordpress';
    wp_remote_post(trailingslashit(INST_FRONTEND_URL) . 'api/revalidate', [
        'blocking' => false,
        'headers'  => ['Content-Type' => 'application/json', 'x-revalidate-secret' => INST_REVALIDATE_SECRET],
        'body'     => wp_json_encode(['tags' => [$tag]]),
    ]);
}, 10, 2);
