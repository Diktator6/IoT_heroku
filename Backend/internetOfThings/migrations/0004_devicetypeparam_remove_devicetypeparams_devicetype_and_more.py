# Generated by Django 4.2.6 on 2023-10-17 13:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('internetOfThings', '0003_devicetype_devicetypeparams'),
    ]

    operations = [
        migrations.CreateModel(
            name='DeviceTypeParam',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('typeName', models.CharField(choices=[('int', 'integer'), ('float', 'float'), ('string', 'string')])),
                ('name', models.CharField()),
            ],
        ),
        migrations.RemoveField(
            model_name='devicetypeparams',
            name='deviceType',
        ),
        migrations.AlterField(
            model_name='devicetype',
            name='name',
            field=models.CharField(),
        ),
        migrations.DeleteModel(
            name='Choice',
        ),
        migrations.DeleteModel(
            name='DeviceTypeParams',
        ),
        migrations.AddField(
            model_name='devicetypeparam',
            name='deviceType',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='internetOfThings.devicetype'),
        ),
    ]
